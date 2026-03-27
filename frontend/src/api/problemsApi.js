import axiosInstance from './axiosInstance'

export const problemsApi = {
  getAll:    (params)  => axiosInstance.get('/problems', { params }),
  getById:   (id)      => axiosInstance.get(`/problems/${id}`),
  create:    (payload) => axiosInstance.post('/problems', payload),
  update:    (id, payload) => axiosInstance.put(`/problems/${id}`, payload),
  remove:    (id)      => axiosInstance.delete(`/problems/${id}`),
  getStats:  ()        => axiosInstance.get('/problems/stats'),
}

export const badgesApi = {
  getAll: () => axiosInstance.get('/badges'),
}

export const profileApi = {
  get:    ()        => axiosInstance.get('/users/profile'),
  update: (payload) => axiosInstance.put('/users/profile', payload),
}
