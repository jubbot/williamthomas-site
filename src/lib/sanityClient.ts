import { createClient } from "@sanity/client";

export const sanity = createClient({
  projectId: "sodd1cif",
  dataset: "production",
  useCdn: true,
  apiVersion: "2024-03-26",
});

export async function getAllProjects() {
  return await sanity.fetch(`*[_type == "project"]{
    _id,
    title,
    "slug": slug.current,
    "thumbnailUrl": thumbnail.url,
    category,
    itemSize
  }`);
}

export async function getProjectBySlug(slug: string) {
  return await sanity.fetch(
    `*[_type == "project" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      projectStartDate,
      projectSponsor,
      projectSponsorType,
      category,
      overview,
      projectImageGallery,
      designWebApp,
      design3DModeling,
      designDigitalMedia,
      technicalCADScopes,
      technicalWebDevScopes,
      toolUsedSoftwares,
      toolsUsedHardware,
      "materialsUsed": materialsUsed[]{
        _key,
        materialGroup,
        "materialNames": materialNames[]{ material }
      },
      "thumbnailUrl": thumbnail.asset->url
    }`,
    { slug }
  );
}

export async function getHomePage() {
  return await sanity.fetch(`*[_type == "homePage"][0]`);
}

export async function getContactPage() {
  return await sanity.fetch(`*[_type == "contactPage"][0]`);
}
