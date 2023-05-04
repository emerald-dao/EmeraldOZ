import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
  try {
    console.log(`../../lib/content/${params.page}.md`)
    const importedContent = await import(
      `../../lib/content/${params.page}.md`
    );

    const content = importedContent.default;

    return {
      content,
      metadata: importedContent.metadata
    };
  } catch (e) {
    throw error(404, 'The content doesnt exist.');
  }
};