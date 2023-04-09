export default () => ({
  applicationId: process.env.ALGOLIA_ID,
  adminKey: process.env.ALGOLIA_ADMIN_KEY,
  searchKey: process.env.ALGOLIA_SEARCH_KEY,
  topicIndexName: process.env.ALGOLIA_INDEX_NAME,
});
