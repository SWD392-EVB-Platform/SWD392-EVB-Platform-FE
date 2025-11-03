import { API_BASE_URL } from '@/shared/constants';
import { Post, PostFormData } from '@/shared/types';

class PostService {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  static async createPost(data: PostFormData): Promise<Post> {
    try {
      const form = new FormData();
      form.append('title', data.title.trim());
      form.append('type', data.type);
      form.append('price', data.price.trim());
      form.append('location', data.location.trim());
      form.append('description', data.description.trim());
      form.append('specs', JSON.stringify(data.specs.filter(s => s.key && s.value)));

      data.images.forEach((file, idx) => {
        form.append('images', file, file.name || `image-${idx}`);
      });

      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Lỗi server: ${response.status}`);
      }

      const result = await response.json().catch(() => null);
      return result;
    } catch (error) {
      console.error('Create post error:', error);
      throw error;
    }
  }

  static async getPosts(params?: { type?: string; status?: string }): Promise<Post[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.type) queryParams.append('type', params.type);
      if (params?.status) queryParams.append('status', params.status);

      const response = await fetch(`${API_BASE_URL}/posts?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Lỗi khi tải danh sách tin đăng');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get posts error:', error);
      throw error;
    }
  }

  static async getPostById(id: number): Promise<Post> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Lỗi khi tải tin đăng');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get post error:', error);
      throw error;
    }
  }

  static async deletePost(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi xóa tin đăng');
      }
    } catch (error) {
      console.error('Delete post error:', error);
      throw error;
    }
  }
}

export default PostService;

