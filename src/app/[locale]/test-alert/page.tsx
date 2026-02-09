"use client";

import { useAlert } from "@/store/useAlertStore";
import { Button } from "@/components/ui/button";

export default function TestAlertPage() {
  const { showAlert } = useAlert();

  return (
    <div className="min-h-screen flex items-center justify-center gap-4 p-8">
      <div className="flex flex-col gap-4 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4">
          اختبار نظام التنبيهات
        </h1>

        <Button
          onClick={() => showAlert("تم الحفظ بنجاح!", true)}
          className="w-full h-12 bg-green-600 hover:bg-green-700"
        >
          اختبار تنبيه النجاح
        </Button>

        <Button
          onClick={() => showAlert("حدث خطأ في العملية!", false)}
          className="w-full h-12 bg-red-600 hover:bg-red-700"
        >
          اختبار تنبيه الخطأ
        </Button>

        <Button
          onClick={() =>
            showAlert(
              "هذه رسالة طويلة جداً لاختبار كيف يتعامل النظام مع النصوص الطويلة في التنبيه",
              true,
            )
          }
          className="w-full h-12 bg-blue-600 hover:bg-blue-700"
        >
          اختبار نص طويل
        </Button>
      </div>
    </div>
  );
}
