import type {
  CartOrder,
  CartOrderItem,
  Review,
  Teacher,
  User,
  Course,
  Profile,
  Question_Answer_Message,
} from "@/types/base";
export interface StudentSummary {
  total_courses: number;
  completed_lessons: number;
  achieved_certificates: number;
}
export interface TeacherStudentList {
  full_name: string;
  image: string;
  country: string;
  date: string;
}
export interface TeacherSummary {
  total_courses: number;
  total_revenue: number;
  monthly_revenue: number;
  total_students: number;
}
export interface TeacherEarning {
  month: number;
  month_name: string;
  year: number;
  total_earning: number;
}
export interface TeacherBestSelling {
  course_image: string;
  course_title: string;
  revenue: number;
  sales: number;
}
export interface NotificationType {
  id: number;
  date: string;
  order: CartOrder;
  order_item: CartOrderItem;
  review: Review;
  seen: boolean;
  teacher: Teacher;
  type: string;
  user: User;
}
export interface TeacherQuestionAndAnsWer {
  course: Course;
  date: string;
  id: number;
  messages: Question_Answer_Message[];
  profile: Profile;
  qa_id: string;
  title: string;
  user: User;
}
export interface AllUserData {
  email: string;
  exp: number;
  full_name: string;
  iat: number;
  jti: string;
  token_type: string;
  user_id: string;
  username: string;
  teacher_id: string;
}
export interface VariantType {
  title: string;
  variant_id?: number; // 后端数据库ID（update时需要）
  course_id?: number;
  items: VariantItemType[];
}
export interface VariantItemType {
  id: string; // 前端唯一标识符
  variant_item_id?: number; // 后端数据库ID（update时需要）
  title: string;
  description: string;
  file: File | string;
  preview: boolean;
}
export interface CourseType {
  category: number;
  file: string;
  image: {
    file: File | undefined;
    preview: ArrayBuffer | string;
  };
  title: string;
  description: string;
  price: string;
  level: string;
  language: string;
  teacher_course_status: string;
}
