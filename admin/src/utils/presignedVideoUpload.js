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
 * Used by artist portal / page media — not admin resource create forms.
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
 * Build multipart FormData for admin resource create/update.
 * Video files go to the API (server → S3), avoiding browser→S3 CORS.
 */
export function buildResourceFormData(
  formState,
  { videoPreview, thumbnailPreview } = {},
) {
  const data = new FormData();
  for (const key in formState) {
    if (key === "video_url") {
      if (formState.video_url instanceof File) {
        data.append("video_url", formState.video_url);
      } else if (
        videoPreview &&
        typeof videoPreview === "string" &&
        !videoPreview.startsWith("blob:")
      ) {
        data.append("video_url", videoPreview);
      }
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
