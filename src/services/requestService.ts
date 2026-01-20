/**
 * Request Service
 * Service untuk mengelola requests (Purchase Order & Investment)
 */

export interface CreateRequestData {
  productId: string;
  clientName: string;
  clientEmail: string;
  quantity: number;
  type: "PURCHASE_ORDER" | "INVESTMENT";
  notes?: string;
}

export interface RequestResponse {
  id: string;
  productId: string;
  userId: string;
  clientName: string;
  clientEmail: string;
  quantity: number;
  type: "PURCHASE_ORDER" | "INVESTMENT";
  status: "PENDING" | "APPROVED" | "REJECTED";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    price: number;
    tefa: {
      name: string;
      major: string;
    };
  };
}

/**
 * Membuat request baru (client)
 */
export async function createRequest(
  data: CreateRequestData,
): Promise<{ message: string; data: RequestResponse }> {
  const response = await fetch("/api/requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create request");
  }

  return response.json();
}

/**
 * Mendapatkan semua request milik user
 */
export async function getMyRequests(): Promise<RequestResponse[]> {
  const response = await fetch("/api/requests");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch requests");
  }

  return response.json();
}

/**
 * Mendapatkan detail request berdasarkan ID
 */
export async function getRequestById(id: string): Promise<RequestResponse> {
  const response = await fetch(`/api/requests/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch request");
  }

  return response.json();
}

/**
 * Cancel/delete request (hanya jika masih PENDING)
 */
export async function cancelRequest(id: string): Promise<{ message: string }> {
  const response = await fetch(`/api/requests/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to cancel request");
  }

  return response.json();
}

/**
 * Admin: Get all requests
 */
export async function getAllRequests(): Promise<RequestResponse[]> {
  const response = await fetch("/api/admin/requests");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch requests");
  }

  return response.json();
}

/**
 * Admin: Update request status
 */
export async function updateRequestStatus(
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED",
): Promise<{ message: string; data: RequestResponse }> {
  const response = await fetch(`/api/admin/requests/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update request status");
  }

  return response.json();
}

/**
 * Admin: Delete request
 */
export async function deleteRequest(id: string): Promise<{ message: string }> {
  const response = await fetch(`/api/admin/requests/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete request");
  }

  return response.json();
}
