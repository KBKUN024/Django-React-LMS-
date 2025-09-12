export interface Teacher {
  id: number; // 主键ID
  user: User; // User对象（完整的用户信息）
  avatar: string | null; // 头像文件路径
  full_name: string;
  bio: string | null; // 简介可以为空
  twitter: string | null; // 社交媒体链接可以为空
  about: string | null; // 详细介绍可以为空
  country: string | null; // 国家可以为空
  students: CartOrderItem[]; // 学生购买记录数组
  courses: Course[]; // 教师课程数组
  review: number; // 课程数量（统计）
}

export interface Category {
  id: number;
  title: string;
  image: string | null;
  slug: string | null;
  active: boolean;
  courses: Course[]; // 分类下的课程数组
}

export interface Course {
  id: number; // 主键ID
  average_rating: number | null;
  category: Category | null;
  course_id: string;
  curriculum: Variant[]; // 课程大纲（课时数组）
  date: string;
  description: string | null; // 描述可以为空
  featured: boolean;
  file: string | null; // 课程文件可以为空
  image: string | null; // 课程封面可以为空
  language: string;
  lectures: VariantItem[]; // 讲座/视频数组
  lectures_count?:number;
  level: string;
  platform_status: string;
  price: string; // 在序列化器中是DecimalField，前端接收为string
  rating_count: number;
  reviews: Review[]; // 评价数组
  slug: string | null; // slug可以为空
  students: EnrolledCourse[]; // 注册学生数组
  teacher: Teacher;
  teacher_course_status: string;
  title: string;
  isInCart: boolean;
  isInWishlist: boolean;
}

export interface Variant {
  id: number;
  course: Course;
  title: string;
  variant_id: string;
  date: string;
  variant_items: VariantItem[]; // 章节下的课时数组
}

export interface VariantItem {
  id: number;
  variant: Variant;
  title: string;
  description: string | null;
  file: string | null; // 视频文件
  duration: string | null; // DurationField在前端表示为字符串
  content_duration: string | null; // 格式化的时长显示
  preview: boolean;
  variant_item_id: string;
  date: string;
}

export interface Question_Answer {
  id: number;
  course: Course;
  user: User | null; // 用户可以为空（SET_NULL）
  title: string | null;
  qa_id: string;
  date: string;
  messages: Question_Answer_Message[]; // 回复消息数组
  profile: Profile;
}

export interface Question_Answer_Message {
  id: number;
  course: Course;
  question: Question_Answer;
  user: User | null; // 用户可以为空（SET_NULL）
  message: string | null;
  qam_id: string;
  date: string;
  profile: Profile; // 消息发送者的个人资料
}

export interface Cart {
  id: number;
  course: Course;
  user: User | null; // 用户可以为空
  price: string; // DecimalField在前端表示为string
  tax_fee: string; // DecimalField在前端表示为string
  total: string; // DecimalField在前端表示为string
  country: string | null;
  cart_id: string;
  date: string;
}

export interface CartOrder {
  id: number;
  student: User | null; // 用户可以为空
  teacher: Teacher[]; // 多对多关系，教师数组
  sub_total: string; // DecimalField在前端表示为string
  tax_fee: string;
  total: string;
  initial_total: string;
  saved: string;
  payment_status: string;
  full_name: string | null;
  email: string | null;
  country: string | null;
  coupons: Coupon[]; // 多对多关系，优惠券数组
  stripe_session_id: string | null;
  cart_order_id: string;
  date: string;
  order_items: CartOrderItem[]; // 订单商品项数组
}

export interface CartOrderItem {
  id: number;
  order: CartOrder;
  course: Course;
  teacher: Teacher;
  price: string; // DecimalField在前端表示为string
  tax_fee: string;
  total: string;
  initial_total: string;
  saved: string;
  coupons: Coupon[]; // 多对多关系，优惠券数组
  applied_coupon: boolean;
  cart_order_item_id: string;
  date: string;
  order_id: string; // 这是模型中的方法，返回格式化的订单ID
  payment_status: string; // 这是模型中的方法，返回支付状态
}

export interface Certificate {
  id: number;
  user: User | null; // 用户可以为空（SET_NULL）
  course: Course;
  certificate_id: string;
  date: string;
}

export interface CompletedLesson {
  id: number;
  user: User | null; // 用户可以为空（SET_NULL）
  course: Course;
  variant_item: VariantItem;
  date: string;
}

export interface EnrolledCourse {
  id: number;
  course: Course;
  user: User | null; // 用户可以为空（SET_NULL）
  teacher: Teacher | null; // 教师可以为空（SET_NULL）
  order_item: CartOrderItem;
  enrollment_id: string;
  date: string;
  lectures: VariantItem[]; // 课程的所有课时数组
  completed_lesson: CompletedLesson[]; // 完成的课时数组
  curriculum: Variant[]; // 课程章节数组
  note: Note[]; // 笔记数组
  question_answer: Question_Answer[]; // 问答数组
  review: Review | null; // 单个评价（一个学生对一个课程只能有一个评价）
}

export interface Note {
  id: number;
  course: Course;
  user: User | null; // 用户可以为空（SET_NULL）
  title: string | null;
  note: string;
  note_id: string;
  date: string;
}

export interface Review {
  id: number;
  course: Course;
  user: User | null; // 用户可以为空（SET_NULL）
  date: string;
  review: string;
  rating: number | null; // 评分可以为空（default=None）
  reply: string | null;
  active: boolean;
  profile: Profile;
}

export interface Notification {
  id: number;
  user: User | null; // 用户可以为空（SET_NULL）
  teacher: Teacher | null; // 教师可以为空（SET_NULL）
  order: CartOrder | null; // 订单可以为空（SET_NULL）
  order_item: CartOrderItem | null; // 订单项可以为空（SET_NULL）
  review: Review | null; // 评价可以为空（SET_NULL）
  type: string;
  seen: boolean;
  date: string;
}

export interface Coupon {
  id: number;
  teacher: Teacher | null; // 教师可以为空（SET_NULL）
  used_by: User[]; // 多对多关系，使用该优惠券的用户数组
  code: string;
  discount: number;
  date: string;
  active: boolean;
}

export interface Wishlist {
  id: number;
  course: Course;
  user: User | null; // 用户可以为空（SET_NULL）
}

export interface Country {
  id: number;
  name: string;
  tax_rate: number;
  active: boolean; // 修正字段名：是否启用
}

// userauths.model
export interface User {
  id: number; // 用户ID（主键）
  username: string; // 唯一用户名
  email: string; // 唯一邮箱地址
  full_name: string; // 用户全名
  otp: string | null; // 一次性密码（可为空）
  refresh_token: string | null; // 刷新令牌（可为空）
}

export interface Profile {
  id: number;
  user: User;
  image: string | null;
  full_name: string;
  country: string | null;
  about: string | null;
  date: string;
}

export interface CartStats {
  price: string;
  tax: string;
  total: string;
}
