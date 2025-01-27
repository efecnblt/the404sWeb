export interface Course {
    courseID: number;
    name: string;
    categoryId: number;
    description: string;
    authorId: number;
    rating: number;
    ratingCount: number;
    price: number;
    discount: number;
    totalStudentCount: number;
    image: string; // image URL
    hashtags?: string;
    levelId?: number;
}
