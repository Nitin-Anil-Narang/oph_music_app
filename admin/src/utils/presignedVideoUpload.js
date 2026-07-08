import axiosApi from "../conf/axios";

/** PUT file to presigned S3 URL (XHR avoids axios headers that break SigV4). */
function putFileToPresignedUrl(uploadUrl, file, contentType, onUploadProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", contentType);

    if (onUploadProgress) {
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) onUploadProgress(ev);
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
        return;
      }
      const detail = (xhr.responseText || "").slice(0, 200);
      reject(
        new Error(
          `Video upload to storage failed (${xhr.status})${detail ? `: ${detail}` : ""}`,
        ),
      );
    };

    xhr.onerror = () => {
      reject(
        new Error(
          "Video upload to storage failed (network/CORS). Ensure the S3 bucket allows PUT from your admin origin.",
        ),
      );
    };

    xhr.send(file);
  });
}

/**
 * Upload a video file via presigned S3 PUT; returns public S3 URL.
 */
export async function uploadVideoViaPresignedPut(file, options = {}) {
  const {
    purpose,
    params = {},
    onUploadProgress,
  } = options;

  if (!file || !(file instanceof File)) {
    throw new Error("A video File is required");
  }
  if (!purpose) {
    throw new Error("presigned upload purpose is required");
  }

  const pres = await axiosApi.get("/presigned-upload/video", {
    params: {
      purpose,
      filename: file.name,
      content_type: file.type || "application/octet-stream",
      ...params,
    },
  });

  if (!pres.data?.success || !pres.data.uploadUrl || !pres.data.publicUrl) {
    throw new Error(pres.data?.message || "Could not prepare video upload");
  }

  const contentType =
    pres.data.contentType || file.type || "application/octet-stream";

  await putFileToPresignedUrl(
    pres.data.uploadUrl,
    file,
    contentType,
    onUploadProgress,
  );

  return pres.data.publicUrl;
}

/**
 * @param {File|string|null|undefined} fileOrUrl
 * @param {string} purpose
 * @param {object} [params]
 */
export async function resolveVideoUrlForUpload(fileOrUrl, purpose, params = {}) {
  if (!fileOrUrl) return null;
  if (typeof fileOrUrl === "string") {
    if (fileOrUrl.startsWith("blob:")) return null;
    return fileOrUrl;
  }
  if (fileOrUrl instanceof File) {
    return uploadVideoViaPresignedPut(fileOrUrl, { purpose, params });
  }
  return null;
}

/** Build multipart FormData for resource create/update (video via presigned PUT). */
export async function buildResourceFormData(
  formState,
  { videoPreview, thumbnailPreview, videoPurpose },
) {
  const videoUrl = await resolveVideoUrlForUpload(
    formState.video_url instanceof File ? formState.video_url : null,
    videoPurpose,
  );
  const finalVideoUrl =
    videoUrl ||
    (videoPreview &&
    typeof videoPreview === "string" &&
    !videoPreview.startsWith("blob:")
      ? videoPreview
      : null);

  const data = new FormData();
  for (const key in formState) {
    if (key === "video_url") {
      if (finalVideoUrl) data.append("video_url", finalVideoUrl);
      continue;
    }
    if (key === "thumbnail_url") {
      if (formState[key] instanceof File) {
        data.append(key, formState[key]);
      } else if (
        formState[key] === null &&
        thumbnailPreview &&
        !String(thumbnailPreview).startsWith("blob:")
      ) {
        data.append(key, thumbnailPreview);
      }
      continue;
    }
    if (formState[key] !== null && formState[key] !== undefined) {
      data.append(key, formState[key]);
    }
  }
  return data;
}
