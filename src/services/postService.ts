export interface Post {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

export interface CreatePostData {
  content: string;
  imageUrl?: string;
  file?: File;
}

export interface UpdatePostData {
  content?: string;
  imageUrl?: string;
  file?: File;
}

export interface PostDestination {
  id: string;
  postId: string;
  platform: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  externalPostId: string | null;
  errorMessage: string | null;
  sentAt: string | null;
  createdAt?: string;
}

const getApiUrl = () => {
  if (typeof window === "undefined") {
    return (
      (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000") +
      "/api/v1/posts"
    );
  }
  return "/api/v1/posts";
};

export const postService = {
  async getAll(sessionToken?: string): Promise<Post[]> {
    const API_URL = getApiUrl();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (sessionToken) {
      headers["Cookie"] = `session_token=${sessionToken}`;
    }

    const response = await fetch(API_URL, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao buscar posts");
    }

    return response.json();
  },

  async getById(id: string, sessionToken?: string): Promise<Post> {
    const API_URL = getApiUrl();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (sessionToken) {
      headers["Cookie"] = `session_token=${sessionToken}`;
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao buscar post");
    }

    return response.json();
  },

  async create(data: CreatePostData | FormData): Promise<Post> {
    const API_URL = getApiUrl();

    let body: any;
    let headers: Record<string, string> = {};

    if (data instanceof FormData) {
      body = data;
      // Fetch will automatically set the correct Content-Type with boundary for FormData
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(data);
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao criar post");
    }

    return response.json();
  },

  async update(id: string, data: UpdatePostData | FormData): Promise<Post> {
    const API_URL = getApiUrl();

    let body: any;
    let headers: Record<string, string> = {};

    if (data instanceof FormData) {
      body = data;
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(data);
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers,
      body,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao atualizar post");
    }

    return response.json();
  },

  async delete(id: string): Promise<void> {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao deletar post");
    }
  },

  // ========== DESTINOS DE PUBLICAÇÃO ==========

  async getDestinations(
    postId: string,
    sessionToken?: string,
  ): Promise<PostDestination[]> {
    const API_URL = getApiUrl();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (sessionToken) {
      headers["Cookie"] = `session_token=${sessionToken}`;
    }

    const response = await fetch(`${API_URL}/${postId}/destinations`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao buscar destinos de publicação");
    }

    return response.json();
  },

  async createDestinations(
    postId: string,
    platforms: string[],
  ): Promise<PostDestination[]> {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/${postId}/destinations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ platforms }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao criar destinos de publicação");
    }

    return response.json();
  },
};
