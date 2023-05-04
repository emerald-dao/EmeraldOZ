import { error, redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
  throw redirect(307, '/overview')
};