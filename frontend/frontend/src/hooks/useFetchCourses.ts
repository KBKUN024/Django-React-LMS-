import type { Course } from "@/types/base";
import { createAuthenticatedAxios } from "@/api/axios";
export function useFetchCourses() {
  const fetchCourse = async (): Promise<Course[]> => {
    try {
      const authAxios = createAuthenticatedAxios();
      const res = await authAxios.get("/course/course-list/");
      // console.log("course list is:", res);
      return res.data;
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      throw error;
    }
  };
  return fetchCourse;
}
