// JSON-based data storage - no external API
import propertiesData from '../data/properties.json';
import blogsData from '../data/blogs.json';
import neighborhoodsData from '../data/neighborhoods.json';

// Property entity with JSON data
export const Property = {
  filter: async (filters = {}, sortBy = null, limit = 100) => {
    let results = [...propertiesData];
    
    // Apply filters
    if (filters.id) {
      results = results.filter(p => p.id === filters.id);
    }
    if (filters.status) {
      results = results.filter(p => p.status === filters.status);
    }
    if (filters.featured !== undefined) {
      results = results.filter(p => p.featured === filters.featured);
    }
    
    // Sort results ONLY if sortBy is explicitly provided
    // Otherwise, maintain the order from the JSON file (as set in content manager)
    if (sortBy) {
      const descending = sortBy.startsWith('-');
      const field = descending ? sortBy.slice(1) : sortBy;
      results.sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        if (descending) {
          return aVal < bVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }
    // If no sortBy, keep original JSON order (from content manager)
    
    // Apply limit
    if (limit) {
      results = results.slice(0, limit);
    }
    
    return results;
  },
  
  list: async () => {
    return [...propertiesData];
  },
  
  get: async (id) => {
    return propertiesData.find(p => p.id === id) || null;
  },
  
  create: async (data) => {
    console.warn('Property.create not implemented for JSON data');
    return null;
  },
  
  update: async (id, data) => {
    console.warn('Property.update not implemented for JSON data');
    return null;
  },
  
  delete: async (id) => {
    console.warn('Property.delete not implemented for JSON data');
    return null;
  },
};

// BlogPost entity with JSON data
export const BlogPost = {
  filter: async (filters = {}, sortBy = null, limit = 100) => {
    let results = [...blogsData];
    
    // Apply filters
    if (filters.id) {
      results = results.filter(p => p.id === filters.id);
    }
    if (filters.published !== undefined) {
      results = results.filter(p => p.published === filters.published);
    }
    if (filters.category) {
      results = results.filter(p => p.category === filters.category);
    }
    if (filters.featured !== undefined) {
      results = results.filter(p => p.featured === filters.featured);
    }
    
    // Sort results ONLY if sortBy is explicitly provided
    // Otherwise, maintain the order from the JSON file (as set in content manager)
    if (sortBy) {
      const descending = sortBy.startsWith('-');
      const field = descending ? sortBy.slice(1) : sortBy;
      results.sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        if (descending) {
          return aVal < bVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }
    // If no sortBy, keep original JSON order (from content manager)
    
    // Apply limit
    if (limit) {
      results = results.slice(0, limit);
    }
    
    // Map fields for compatibility (author -> author_name, featured_image -> cover_image)
    return results.map(post => ({
      ...post,
      author_name: post.author_name || post.author,
      cover_image: post.cover_image || post.featured_image,
    }));
  },
  
  list: async () => {
    return blogsData.map(post => ({
      ...post,
      author_name: post.author_name || post.author,
      cover_image: post.cover_image || post.featured_image,
    }));
  },
  
  get: async (id) => {
    const post = blogsData.find(p => p.id === id);
    if (!post) return null;
    return {
      ...post,
      author_name: post.author_name || post.author,
      cover_image: post.cover_image || post.featured_image,
    };
  },
  
  create: async (data) => {
    console.warn('BlogPost.create not implemented for JSON data');
    return null;
  },
  
  update: async (id, data) => {
    console.warn('BlogPost.update not implemented for JSON data');
    return null;
  },
  
  delete: async (id) => {
    console.warn('BlogPost.delete not implemented for JSON data');
    return null;
  },
};

export const ContactSubmission = {
  filter: () => Promise.resolve([]),
  list: () => Promise.resolve([]),
  get: () => Promise.resolve(null),
  create: () => Promise.resolve(null),
  update: () => Promise.resolve(null),
  delete: () => Promise.resolve(null),
};

export const SavedProperty = {
  filter: () => Promise.resolve([]),
  list: () => Promise.resolve([]),
  get: () => Promise.resolve(null),
  create: () => Promise.resolve(null),
  update: () => Promise.resolve(null),
  delete: () => Promise.resolve(null),
};

// Neighborhood entity with JSON data
export const Neighborhood = {
  filter: async (filters = {}, sortBy = null, limit = 100) => {
    let results = [...neighborhoodsData];

    // Apply filters
    if (filters.id) {
      results = results.filter(n => n.id === filters.id);
    }
    if (filters.published !== undefined) {
      results = results.filter(n => n.published === filters.published);
    }
    if (filters.featured !== undefined) {
      results = results.filter(n => n.featured === filters.featured);
    }

    // Sort results ONLY if sortBy is explicitly provided
    // Otherwise, maintain the order from the JSON file (as set in content manager)
    if (sortBy) {
      const descending = sortBy.startsWith('-');
      const field = descending ? sortBy.slice(1) : sortBy;
      results.sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        if (descending) {
          return aVal < bVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }
    // If no sortBy, keep original JSON order (from content manager)

    // Apply limit
    if (limit) {
      results = results.slice(0, limit);
    }

    return results;
  },

  list: async () => {
    return [...neighborhoodsData];
  },

  get: async (id) => {
    return neighborhoodsData.find(n => n.id === id) || null;
  },

  create: async (data) => {
    console.warn('Neighborhood.create not implemented for JSON data');
    return null;
  },

  update: async (id, data) => {
    console.warn('Neighborhood.update not implemented for JSON data');
    return null;
  },

  delete: async (id) => {
    console.warn('Neighborhood.delete not implemented for JSON data');
    return null;
  },
};

export const User = {
  me: () => Promise.resolve(null),
  list: () => Promise.resolve([]),
  update: () => Promise.resolve(null),
  logout: () => Promise.resolve(null),
};
