const url_base = import.meta.env.PUBLIC_WAGTAIL_API;

export const getBlogPost = async () => {
  try {
    const res = await fetch(
      `${url_base}/pages/?type=skills_blog.ArticlePage&fields=*`,
    );

    if (!res.ok) {
      throw new Error(`Error en la petición: ${res.status}`);
    }

    const data = await res.json();
    return data.items;
  } catch (error) {
    console.error("Error al traer posts de Wagtail", error);
    return [];
  }
};
