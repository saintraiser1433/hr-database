export const getAdjectiveRatingFromTemplateDetail = (rating: number, templateDetails: any[]): string => {
    const sortedTemplateDetails = templateDetails.sort((a, b) => b.score - a.score);
    const templateDetail = sortedTemplateDetails.find((detail) => rating >= detail.score);
    return templateDetail?.title || 'Unknown';
};