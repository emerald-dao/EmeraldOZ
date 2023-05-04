import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
  try {
    const importedContent = await import(
      `../../lib/content/${params.name}.md`
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