// CKEditor是一个强大的富文本编辑器库，用于在React应用中集成CKEditor 5
// 它提供了现代化的所见即所得(WYSIWYG)编辑体验，支持格式化文本、图片插入、表格等功能
// 常用于课程描述、文章内容等需要富文本编辑的场景
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Image, Spinner } from 'react-bootstrap';
import { FaArrowLeft, FaCheckCircle, FaTrash } from 'react-icons/fa';
import type { VariantItemType, VariantType, CourseType } from '@/types'
import type { Category, Course, Variant } from '@/types/base'
import { useEffect, useCallback } from 'react';

export function CourseEditAndCreate({ course, currentCourse, setCourse, setCKEditorData, handleFileChange, handleCourseIntroVideoChange, handleCourseInputChange, category_list, ckEdtitorData,
    handleCKEditorChange, variants, setVariants, handleVariantChange, removeVariant, handleItemChange, addVariants, addItem, createCourse, removeItem, isPending, type, updateCourse
}: {
    course?: CourseType,
    setCourse?: React.Dispatch<React.SetStateAction<CourseType>>,
    currentCourse?: Course,
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleCourseIntroVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleCourseInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void,
    category_list: Category[] | undefined,
    ckEdtitorData: string,
    setCKEditorData?: (value: React.SetStateAction<string>) => void,
    handleCKEditorChange: (_event: unknown, editor: ClassicEditor) => void,
    variants: VariantType[],
    setVariants?: React.Dispatch<React.SetStateAction<VariantType[]>>,
    handleVariantChange: (index: number, value: string) => void,
    removeVariant: (variantIndex: number, variant_id?: number | undefined, course_id?: number | undefined, isUpdate?: boolean) => void,
    handleItemChange: <K extends keyof VariantItemType>(variantIndex: number, variantItemIndex: number, propertyName: K, value: VariantItemType[K], type: string) => void,
    addVariants: (isUpdate: boolean) => void,
    addItem: (variantIndex: number) => void,
    createCourse?: () => void,
    removeItem: (variantIndex: number, variantItemIndex: number, isUpdate?: boolean, variant_id?: number | undefined, course_id?: number | undefined, variant_item_id?: number | undefined) => void,
    isPending: boolean,
    updateCourse?: () => void,
    type: 'create' | 'update'

}) {
    // 生成唯一ID的函数
    const generateUniqueId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };

    // 转换API返回的Variant[]为组件使用的VariantType[]格式
    const convertVariantsToLocalFormat = useCallback((apiVariants: Variant[]): VariantType[] => {
        return apiVariants.map(variant => ({
            title: variant.title,
            variant_id: Number(variant.variant_id), // 保存后端ID
            course_id: Number(variant.course.course_id),
            items: variant.variant_items.map(item => ({
                id: generateUniqueId(), // 前端唯一ID
                variant_item_id: parseInt(item.variant_item_id), // 转换为number类型
                title: item.title,
                description: item.description || '',
                file: item.file || '',
                preview: item.preview
            }))
        }));
    }, []);

    // 初始化update模式的数据
    useEffect(() => {
        if (type === 'update' && currentCourse && setVariants && setCKEditorData && setCourse) {
            // 设置CKEditor数据
            setCKEditorData(String(currentCourse.description || ''));

            // 设置课程基本信息
            setCourse({
                category: Number(currentCourse.category) || 0,
                file: currentCourse.file || '',
                image: {
                    file: undefined,
                    preview: String(currentCourse.image || '')
                },
                title: currentCourse.title,
                description: currentCourse.description || '',
                price: String(currentCourse.price || ''),
                level: currentCourse.level,
                language: currentCourse.language,
                teacher_course_status: currentCourse.teacher_course_status || 'Draft'
            });

            // 转换并设置variants数据
            if (currentCourse.curriculum && currentCourse.curriculum.length > 0) {
                const convertedVariants = convertVariantsToLocalFormat(currentCourse.curriculum);
                setVariants(convertedVariants);
            }
        }
    }, [currentCourse, type, setVariants, setCKEditorData, setCourse, convertVariantsToLocalFormat])
    return (
        <Col lg={9} md={8} xs={12}>
            <>
                <section className="py-4 py-lg-6 bg-primary rounded-3">
                    <Container>
                        <Row>
                            <Col lg={{ span: 10, offset: 1 }} md={12} xs={12}>
                                <div className="d-lg-flex align-items-center justify-content-between">
                                    {/* Content */}
                                    <div className="mb-4 mb-lg-0">
                                        <h1 className="text-white mb-1">{type == 'create' ? 'Add New Course' : 'Update Course'}</h1>
                                        <p className="mb-0 text-white lead">
                                            Just fill the form and create your courses.
                                        </p>
                                    </div>
                                    <div>
                                        <Link to="/instructor/courses/" className="btn btn-light me-2">
                                            <FaArrowLeft /> Back to Course
                                        </Link>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
                <section className="pb-8 mt-5">
                    <Card className="mb-3">

                        {/* Basic Info Section */}
                        <Card.Header className="border-bottom px-4 py-3">
                            <h4 className="mb-0">Basic Information</h4>
                        </Card.Header>
                        <Card.Body>
                            <Form.Label htmlFor="courseTHumbnail">Thumbnail Preview</Form.Label>
                            <Image
                                src={String(course?.image.preview || "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png")}
                                alt=""
                                fluid
                                rounded
                                className='mb-4'
                                style={{ width: "100%", height: "330px", objectFit: "cover" }}
                            />
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="courseTHumbnail">Course Thumbnail</Form.Label>
                                <Form.Control
                                    id="courseTHumbnail"
                                    type="file"
                                    name='image'
                                    onChange={handleFileChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="introvideo">
                                    Intro Video
                                </Form.Label>
                                <Form.Control
                                    id="introvideo"
                                    type="file"
                                    name='file'
                                    onChange={handleCourseIntroVideoChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="courseTitle">
                                    Title
                                </Form.Label>
                                <Form.Control
                                    id="courseTitle"
                                    type="text"
                                    placeholder="Input Your Course Title Here."
                                    name='title'
                                    value={course?.title || ''}
                                    onChange={handleCourseInputChange}
                                />
                                <Form.Text className="text-muted">
                                    Write a 60 character course title.
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Courses category</Form.Label>
                                <Form.Select name='category' value={course?.category || 0} onChange={handleCourseInputChange}>
                                    <option value="0">-------------</option>
                                    {
                                        category_list?.map((category, index) => (
                                            <option key={index} value={category.id}>{category.title}</option>
                                        ))
                                    }
                                </Form.Select>
                                <Form.Text className="text-muted">
                                    Help people find your courses by choosing categories
                                    that represent your course.
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Courses level</Form.Label>
                                <Form.Select value={course?.level || ''} name='level' onChange={handleCourseInputChange}>
                                    <option value="">Select level</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intemediate">Intemediate</option>
                                    <option value="Advanced">Advanced</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Course language</Form.Label>
                                <Form.Select value={course?.language || ''} name='language' onChange={handleCourseInputChange}>
                                    <option value="">Select language</option>
                                    <option value="Chinese">Chinese</option>
                                    <option value="English">English</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="French">French</option>
                                    <option value="Japanese">Japanese</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Course Description</Form.Label>
                                <CKEditor editor={ClassicEditor} data={ckEdtitorData} onChange={handleCKEditorChange} />
                                <Form.Text className="text-muted">
                                    A brief summary of your courses.
                                </Form.Text>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label htmlFor="coursePrice">
                                    Price
                                </Form.Label>
                                <Form.Control
                                    id="coursePrice"
                                    type="number"
                                    placeholder="$20.99"
                                    name='price'
                                    value={course?.price || ''}
                                    onChange={handleCourseInputChange}
                                />
                            </Form.Group>
                        </Card.Body>


                        {/* Curriculum Section */}
                        <Card.Header className="border-bottom px-4 py-3">
                            <h4 className="mb-0">Curriculum</h4>
                        </Card.Header>
                        <Card.Body>
                            {
                                variants?.map((variant, variantIndex) => (
                                    <>
                                        <div key={variantIndex + 'variant'} className='border p-2 rounded-3 mb-3' style={{ backgroundColor: "#ededed" }}>
                                            <div className="d-flex mb-4">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Section Name"
                                                    required
                                                    value={variant.title}
                                                    onChange={(e) => handleVariantChange(variantIndex, e.target.value)}
                                                />
                                                <Button variant="danger" className='ms-2' type='button' onClick={() => removeVariant(variantIndex, variant.variant_id, variant.course_id, type == 'create' ? false : true)}>
                                                    <FaTrash />
                                                </Button>
                                            </div>
                                            {
                                                variant.items.map((item, variantItemIndex) => (
                                                    <div key={item.id} className=' mb-2 mt-2 shadow p-2 rounded-3 ' style={{ border: "1px #bdbdbd solid" }}>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Lesson Title"
                                                            className='me-1 mt-2'
                                                            name='title'
                                                            value={item.title}
                                                            onChange={(e) => handleItemChange(variantIndex, variantItemIndex, 'title', e.target.value, e.target.type)}
                                                        />
                                                        <Form.Control
                                                            as="textarea"
                                                            className='mt-2'
                                                            placeholder='Lesson Description'
                                                            rows={4}
                                                            name='description'
                                                            value={item.description}
                                                            onChange={(e) => handleItemChange(variantIndex, variantItemIndex, 'description', e.target.value, e.target.type)}
                                                        />
                                                        <Row className="d-flex align-items-center">
                                                            <Col lg={8}>
                                                                <Form.Control
                                                                    type="file"
                                                                    placeholder="Item Price"
                                                                    className="me-1 mt-2"
                                                                    name="file"
                                                                    onChange={(e) => {
                                                                        const target = e.target as HTMLInputElement;
                                                                        const file = target.files?.[0];
                                                                        handleItemChange(variantIndex, variantItemIndex, 'file', file || "", target.type);
                                                                    }}
                                                                />
                                                            </Col>
                                                            <Col lg={4}>
                                                                <Form.Label htmlFor={`checkbox${variantIndex}-${variantItemIndex}`}>
                                                                    Preview
                                                                </Form.Label>
                                                                <Form.Check
                                                                    type="checkbox"
                                                                    className="ms-2"
                                                                    name="preview"
                                                                    id={`checkbox${variantIndex}-${variantItemIndex}`}
                                                                    checked={item.preview}
                                                                    onChange={(e) => handleItemChange(variantIndex, variantItemIndex, 'preview', e.target.checked, e.target.type)}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Button variant="outline-danger" size="sm" className='me-2 mt-2' type='button' onClick={() => removeItem(variantIndex, variantItemIndex, type == 'create' ? false : true, variant.variant_id, variant.course_id, item.variant_item_id)}>
                                                            Delete Lesson <FaTrash />
                                                        </Button>
                                                    </div>
                                                ))
                                            }
                                            <Button variant="primary" size="sm" className='mt-2' type='button' onClick={() => addItem(variantIndex)}>
                                                + Add Lesson
                                            </Button>
                                        </div >
                                        {/* 添加分割线，最后一个章节不显示分割线 */}
                                        {
                                            variantIndex < variants.length - 1 && (
                                                <hr className="my-4" style={{ borderColor: "#202020", borderWidth: "2px", borderStyle: 'dashed' }} />
                                            )
                                        }
                                    </>
                                ))
                            }
                            <Button variant="secondary" size="sm" className='w-100 mt-2' type='button' onClick={() => addVariants(type == 'create' ? false : true)}>
                                + New Section
                            </Button>
                        </Card.Body>

                    </Card>
                    <Button variant="success" size="lg" className='w-100 mt-2' type='button' onClick={type == 'create' ? createCourse : updateCourse} disabled={isPending}>
                        {
                            isPending ?
                                <>
                                    {type == 'create' ? 'Creating' : 'Updating'}... <Spinner animation="border" style={{ width: 20, height: 20, marginLeft: 5 }} />
                                </>
                                :
                                <>
                                    {type == 'create' ? 'Create' : 'Update'} Course <FaCheckCircle />

                                </>
                        }
                    </Button>
                </section>
            </>

        </Col >
    )
}