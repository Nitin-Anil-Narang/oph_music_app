const express = require("express");
const router = express.Router();
const Resource = require("../controllers/resource");
const authMiddleware = require("../../middleware/authenticate");
const multer = require("multer");
const os = require("os");
const path = require("path");
const fs = require("fs");

const resourceUploadDir = path.join(os.tmpdir(), "oph-resource-uploads");
fs.mkdirSync(resourceUploadDir, { recursive: true });

/** Admin resource videos upload via API → S3 (avoids browser→S3 CORS on presigned PUT). */
const resourceUpload = multer({
  storage: multer.diskStorage({
    destination: resourceUploadDir,
    filename: (_req, file, cb) => {
      const safe = String(file.originalname || "file").replace(
        /[^a-zA-Z0-9._-]/g,
        "_",
      );
      cb(null, `${Date.now()}-${safe}`);
    },
  }),
  limits: { fileSize: 500 * 1024 * 1024 },
});

const resourceMediaFields = [
  { name: "thumbnail_url", maxCount: 1 },
  { name: "video_url", maxCount: 1 },
];

router.get("/podcast/search", Resource.searchPodcasts);
router.post(
  "/createPodcast",
  resourceUpload.fields(resourceMediaFields),
  Resource.insertPodcast,
);

router.get("/allPodcasts", Resource.fetchAllPodcast);
router.get("/podcast/by-slug/:slug", Resource.getPodcastBySlug);
router.get(`/podcast/:podcastId`, Resource.getPodcastById);
router.put(
  "/update_podcast/:podcastId",
  resourceUpload.fields(resourceMediaFields),
  Resource.updatePodcastById,
);

router.delete("/delete_podcast/:id", Resource.deletePodcast);

//Reels
router.post(
  "/createReels",
  resourceUpload.fields(resourceMediaFields),
  Resource.insertReels,
);
router.get("/allReels", Resource.fetchAllReels);
router.get("/reel/by-slug/:slug", Resource.getReelBySlug);
router.get(`/reel/:reelId`, Resource.getReelById);
router.put(
  "/update_reel/:reelId",
  resourceUpload.fields(resourceMediaFields),
  Resource.updateReelById,
);

router.delete("/delete_reel/:id", Resource.deleteReel);

//Stories
router.post(
  "/createStories",
  resourceUpload.fields(resourceMediaFields),
  Resource.insertStories,
);
router.get("/allStories", Resource.fetchAllStories);
router.get("/story/by-slug/:slug", Resource.getStoryBySlug);
router.get(`/story/:storyId`, Resource.getStroyById);
router.put(
  "/update_story/:storyId",
  resourceUpload.fields(resourceMediaFields),
  Resource.updateStroyById,
);

router.delete("/delete_story/:id", Resource.deleteStory);

//Learning
router.post(
  "/createLearning",
  resourceUpload.fields(resourceMediaFields),
  Resource.insertLearning,
);
router.get("/allLearning", Resource.fetchAllLearning);
router.get(
  "/learning/visible-for-artist",
  authMiddleware,
  Resource.fetchLearningVisibleForArtist,
);
router.get("/learning/by-slug/:slug", Resource.getLearningBySlug);
router.get(`/learning/:learningId`, Resource.getLearningById);
router.put(
  "/update_learning/:learningId",
  resourceUpload.fields(resourceMediaFields),
  Resource.updateLearningById,
);
router.delete("/delete_learning/:id", Resource.deleteLearning);

module.exports = router;
