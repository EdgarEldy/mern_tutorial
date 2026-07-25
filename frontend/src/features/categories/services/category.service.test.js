import axiosInstance from '../../../lib/axios';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from './category.service';

vi.mock('../../../lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('category service', () => {
  afterEach(() => vi.clearAllMocks());

  it('getCategories calls GET /categories', async () => {
    axiosInstance.get.mockResolvedValue({ data: { data: [] } });
    await getCategories();
    expect(axiosInstance.get).toHaveBeenCalledWith('/categories');
  });

  it('getCategoryById calls GET /categories/:id', async () => {
    axiosInstance.get.mockResolvedValue({ data: { data: {} } });
    await getCategoryById(3);
    expect(axiosInstance.get).toHaveBeenCalledWith('/categories/3');
  });

  it('createCategory calls POST /categories with data', async () => {
    const data = { category_name: 'Electronics' };
    axiosInstance.post.mockResolvedValue({ data: { data } });
    await createCategory(data);
    expect(axiosInstance.post).toHaveBeenCalledWith('/categories', data);
  });

  it('updateCategory calls PUT /categories/:id with data', async () => {
    const data = { category_name: 'Updated Electronics' };
    axiosInstance.put.mockResolvedValue({ data: { data } });
    await updateCategory(3, data);
    expect(axiosInstance.put).toHaveBeenCalledWith('/categories/3', data);
  });

  it('deleteCategory calls DELETE /categories/:id', async () => {
    axiosInstance.delete.mockResolvedValue({ data: { success: true } });
    await deleteCategory(3);
    expect(axiosInstance.delete).toHaveBeenCalledWith('/categories/3');
  });
});
