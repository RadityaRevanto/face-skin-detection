import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/server-client";
import { removeAuthToken } from "@/lib/auth/token";

export async function GET(request: NextRequest) {
  try {
    const result = await fetchApi("/profile", {
      method: "GET",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Gagal mengambil profil" 
      },
      { status: error.status || 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let body: BodyInit;
    let headers: Record<string, string> = {};

    if (contentType.includes("multipart/form-data")) {
      body = await request.formData();
    } else {
      const jsonData = await request.json();
      body = JSON.stringify(jsonData);
      headers["Content-Type"] = "application/json";
    }

    const result = await fetchApi("/profile", {
      method: "PATCH",
      headers: headers,
      body: body,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Profile update error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Gagal menyimpan profil" 
      },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const result = await fetchApi("/profile", {
      method: "DELETE",
    });

    // Clear local auth token if successful
    await removeAuthToken();

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Profile delete error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Gagal menghapus akun" 
      },
      { status: error.status || 500 }
    );
  }
}
