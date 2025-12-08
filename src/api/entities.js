// Base44 entities removed - no longer using Base44 API

// Stub exports to prevent import errors
export const Property = {
  filter: () => Promise.resolve([]),
  list: () => Promise.resolve([]),
  get: () => Promise.resolve(null),
  create: () => Promise.resolve(null),
  update: () => Promise.resolve(null),
  delete: () => Promise.resolve(null),
};

export const BlogPost = {
  filter: () => Promise.resolve([]),
  list: () => Promise.resolve([]),
  get: () => Promise.resolve(null),
  create: () => Promise.resolve(null),
  update: () => Promise.resolve(null),
  delete: () => Promise.resolve(null),
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

export const Neighborhood = {
  filter: () => Promise.resolve([]),
  list: () => Promise.resolve([]),
  get: () => Promise.resolve(null),
  create: () => Promise.resolve(null),
  update: () => Promise.resolve(null),
  delete: () => Promise.resolve(null),
};

export const User = {
  me: () => Promise.resolve(null),
  list: () => Promise.resolve([]),
  update: () => Promise.resolve(null),
  logout: () => Promise.resolve(null),
};
