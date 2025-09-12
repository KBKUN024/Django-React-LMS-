// CKEditor是一个强大的富文本编辑器库，用于在React应用中集成CKEditor 5
// 它提供了现代化的所见即所得(WYSIWYG)编辑体验，支持格式化文本、图片插入、表格等功能
// 常用于课程描述、文章内容等需要富文本编辑的场景
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useState } from "react";
import { createAuthenticatedAxios } from "@/api/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Category, Course } from "@/types/base";
import type { VariantItemType, VariantType, CourseType } from "@/types";
import { getCurrentTeacherId } from "@/api/constants";
import { generateRandom10DigitNumber, handleMutationError } from "@/utils";
import Toast from "@/utils/SweetAlert2/Toast";
// 生成唯一ID的函数
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

function useCourseCreateOrUpdate() {
  const authAxios = createAuthenticatedAxios();
  const teacherId = getCurrentTeacherId();

  const [course, setCourse] = useState<CourseType>({
    category: 0,
    file: "",
    image: {
      file: undefined,
      preview: "",
    },
    title: "",
    description: "",
    price: "",
    level: "",
    language: "",
    teacher_course_status: "",
  });

  const [ckEdtitorData, setCKEditorData] = useState("");

  const [variants, setVariants] = useState<VariantType[]>([
    {
      title: "",
      items: [
        {
          id: generateUniqueId(),
          title: "",
          description: "",
          file: "",
          preview: false,
        },
      ],
    },
  ]);

  const fetchCategory = async (): Promise<Category[]> => {
    const res = await authAxios.get("/course/category/");
    return res.data;
  };

  const createAndUpdateFn = (isUpdate: boolean = false) => {
    console.log(`=== createAndUpdateFn called with isUpdate: ${isUpdate} ===`);
    console.log("Course data:", course);
    console.log("Variants data:", variants);

    const formData = new FormData();
    formData.append("title", course.title);
    if (course.image.file) {
      formData.append("image", course.image.file);
    }
    formData.append("description", ckEdtitorData);
    formData.append("category", String(course.category));
    formData.append("price", course.price);
    formData.append("level", course.level);
    formData.append("language", course.language);
    formData.append("teacher", String(teacherId));

    /**
     * 对章节进行遍历
     * 下面的console输出：
     * key is title,value is 1111
     * key is items,value is [object Object]
     * 因为formData传到后端是一个字典，所以后端对这个字典进行遍历
     * formData.append(`variant[${variantIndex}][variant_${key}]`, value) 会得到👇
     * variant[0][variant_title] 和 variant[0][variant_items],我们需要的是前者
     * 后端代码中也有体现: if key.startswith("variant") and "[variant_title]" in key
     */
    variants.forEach((variant, variantIndex) => {
      // 添加variant基本信息
      formData.append(
        `variants[${variantIndex}][variant_title]`,
        variant.title
      );

      // 如果是更新模式且有variant_id，添加它
      if (isUpdate && variant.variant_id) {
        formData.append(
          `variants[${variantIndex}][variant_id]`,
          String(variant.variant_id)
        );
      }

      console.log(`Processing variant ${variantIndex}: ${variant.title}`);

      /**
       * 对章节的子项items进行遍历
       */
      variant.items.forEach((variantItem, variantItemIndex) => {
        // 只处理实际的数据字段，跳过id字段
        const itemFields = ["title", "description", "file", "preview"];

        itemFields.forEach((field) => {
          if (field in variantItem) {
            const value = variantItem[field as keyof typeof variantItem];
            console.log(`variantItem ${field}: ${value}`);
            formData.append(
              `variants[${variantIndex}][items][${variantItemIndex}][${field}]`,
              String(value)
            );
          }
        });

        // 如果是更新模式且有variant_item_id，添加它
        if (isUpdate && variantItem.variant_item_id) {
          formData.append(
            `variants[${variantIndex}][items][${variantItemIndex}][variant_item_id]`,
            String(variantItem.variant_item_id)
          );
        }
      });
      console.log("==========");
    });
    return formData;
  };

  const { data: category_list } = useQuery({
    queryKey: ["course-category-list"],
    queryFn: fetchCategory,
  });
  console.log("in hooks, variants:", variants);
  console.log(course);
  /**
   * 添加了HTMLTextAreaElement会报错：
   * 
   * 类型“(EventTarget & HTMLTextAreaElement) | (EventTarget & HTMLInputElement)”上不存在属性“checked”。
     类型“EventTarget & HTMLTextAreaElement”上不存在属性“checked”。ts(2339)

     原因：checked 属性只存在于某些 HTMLInputElement（如 checkbox、radio）上，而 HTMLTextAreaElement 和 HTMLSelectElement 都没有这个属性。
     
     通过 'checked' in target 检查可以确保只有在元素确实有 checked 属性时才访问它。
   */
  const handleCourseInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setCourse({
      ...course,
      [event.target.name]:
        event.target.type === "checkbox" && "checked" in event.target
          ? event.target.checked
          : event.target.value,
    });
  };

  /**
   * CKEditor 5 的 onChange 回调接收两个参数：(event, editor)，而不是直接传递 editor。
   */
  const handleCKEditorChange = (_event: unknown, editor: ClassicEditor) => {
    const data = editor.getData();
    setCKEditorData(data);
    console.log(data); // 注意：这里应该打印 data 而不是 ckEdtitorData
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 创建文件预览URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCourse({
            ...course,
            image: {
              file: e.target.files?.[0],
              preview: String(event.target?.result || ""),
            },
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCourseIntroVideoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCourse({
      ...course,
      [e.target.name]: e.target.files?.[0],
    });
  };
  const handleVariantChange = (index: number, value: string) => {
    const updatedVariants = [...variants];
    updatedVariants[index].title = value;
    setVariants(updatedVariants);
    console.log(`Name: title - value: ${value} - Index: ${index}`);
  };
  const handleItemChange = <K extends keyof VariantItemType>(
    variantIndex: number,
    variantItemIndex: number,
    propertyName: K,
    value: VariantItemType[K],
    type: string
  ) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].items[variantItemIndex][propertyName] = value;
    setVariants(updatedVariants);

    console.log(
      `Name: ${propertyName} - value: ${value} - Index: ${variantIndex} ItemIndex: ${variantItemIndex} - type: ${type}`
    );
  };

  const addVariants = (isUpdate: boolean = false, currentCourse?: Course) => {
    // ...variants下面不要写成 {} as VariantType,这样是类型断言，可能会跳过ts类型检查

    if (isUpdate && currentCourse) {
      let lastVariantId = 0;
      let lastVariantItemId = generateRandom10DigitNumber();
      variants.forEach((v) => {
        lastVariantId = Number(v.variant_id);
      });
      setVariants([
        ...variants,
        {
          title: "",
          variant_id: lastVariantId + 1,
          items: [
            {
              id: generateUniqueId(),
              title: "",
              description: "",
              file: "",
              preview: false,
              variant_item_id: parseInt(lastVariantItemId),
            },
          ],
        },
      ]);
    } else {
      setVariants([
        ...variants,
        {
          title: "",
          items: [
            {
              id: generateUniqueId(),
              title: "",
              description: "",
              file: "",
              preview: false,
            },
          ],
        },
      ]);
    }
  };

  const removeVariantMutation = useMutation({
    mutationFn: async (variables: {
      variant_id: number;
      teacher_id: number;
      course_id: number;
    }) => {
      const res = await authAxios.delete(
        `teacher/course/variant-delete/${variables.variant_id}/${variables.teacher_id}/${variables.course_id}/`
      );
      return res.data;
    },
    onSuccess: (data) => {
      console.log("删除章节成功,data:", data);
      Toast.fire({
        icon: "success",
        text: "删除章节成功",
      });
    },
    onError: (error) => {
      console.log("删除章节失败,", error);
      const errorMessage = handleMutationError(error);

      Toast.fire({
        icon: "error",
        text: errorMessage,
      });
    },
  });
  const removeVariantItemMutation = useMutation({
    mutationFn: async (variables: {
      variant_id: number;
      variant_item_id: number;
      teacher_id: number;
      course_id: number;
    }) => {
      const res = await authAxios.delete(
        `teacher/course/variant-item-delete/${variables.variant_id}/${variables.variant_item_id}/${variables.teacher_id}/${variables.course_id}/`
      );
      return res.data;
    },
    onSuccess: (data) => {
      console.log("删除课程成功,data:", data);
      Toast.fire({
        icon: "success",
        text: "删除课程成功",
      });
    },
    onError: (error) => {
      console.log("删除课程失败,", error);
      const errorMessage = handleMutationError(error);

      Toast.fire({
        icon: "error",
        text: errorMessage,
      });
    },
  });

  const removeVariant = (
    variantIndex: number,
    variant_id?: number,
    course_id?: number,
    isUpdate: boolean = false
  ) => {
    const remove_variant_fn = (variantIndex: number) => {
      const updatedVariants = [...variants];
      // splice(index, 1) 从数组中删除元素：index是开始位置，1是删除的数量
      // 即从指定索引位置开始删除1个元素，实现移除指定章节的功能
      updatedVariants.splice(variantIndex, 1);
      setVariants(updatedVariants);
    };
    if (isUpdate) {
      // 执行删除请求，成功之后再调用 remove_variant_fn
      removeVariantMutation.mutate(
        {
          variant_id: Number(variant_id),
          teacher_id: Number(teacherId),
          course_id: Number(course_id),
        },
        { onSuccess: () => remove_variant_fn(variantIndex) }
      );
    } else {
      remove_variant_fn(variantIndex);
    }
  };

  const addItem = (variantIndex: number) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].items.push({
      id: generateUniqueId(),
      title: "",
      description: "",
      file: "",
      preview: false,
      variant_item_id: parseInt(generateRandom10DigitNumber()),
    });
    setVariants(updatedVariants);
  };
  const removeItem = (
    variantIndex: number,
    variantItemIndex: number,
    isUpdate: boolean = false,
    variant_id?: number,
    course_id?: number,
    variant_item_id?: number
  ) => {
    const remove_item_fn = () => {
      const updatedVariants = [...variants];
      updatedVariants[variantIndex].items.splice(variantItemIndex, 1);
      setVariants(updatedVariants);
    };
    if (isUpdate) {
      removeVariantItemMutation.mutate(
        {
          variant_id: Number(variant_id),
          variant_item_id: Number(variant_item_id),
          teacher_id: Number(teacherId),
          course_id: Number(course_id),
        },
        { onSuccess: () => remove_item_fn() }
      );
      if (removeVariantItemMutation.isSuccess) {
        remove_item_fn();
      }
    } else {
      remove_item_fn();
    }
  };

  return {
    course,
    setCourse,
    variants,
    setVariants,
    category_list,
    ckEdtitorData,
    setCKEditorData,
    fetchCategory,
    handleCourseInputChange,
    handleCKEditorChange,
    handleFileChange,
    handleCourseIntroVideoChange,
    handleVariantChange,
    handleItemChange,
    addVariants,
    removeVariant,
    addItem,
    removeItem,
    generateUniqueId,
    createAndUpdateFn,
  };
}
export { useCourseCreateOrUpdate };
