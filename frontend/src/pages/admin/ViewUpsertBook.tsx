import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
    Breadcrumb,
    Col,
    Row,
    message,
    notification,
    Upload,
    Image,
    Form,
    Card,
    Space,
    Typography,
    Tabs,
} from "antd";
import {
    FooterToolbar,
    ProForm,
    ProFormText,
    ProFormDigit,
    ProFormSelect,
    ProFormTextArea,
} from "@ant-design/pro-components";
import {
    CheckSquareOutlined,
    PlusOutlined,
    BookOutlined,
    DollarOutlined,
    FileTextOutlined,
    TagsOutlined,
    PictureOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import RichTextEditor from "../../components/common/RichTextEditor";
import bookApi from "../../api/bookApi";
import fileApi from "../../api/fileApi";
import { Book } from "../../types";
import toast from "react-hot-toast";
import { SUPPLIERS, CATEGORIES } from "../../data/bookData";
import AdminLayout from "./AdminLayout";

const { Title, Text } = Typography;

const ViewUpsertBook = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const id = params?.get("id");

    const [form] = Form.useForm();
    const [dataUpdate, setDataUpdate] = useState<Book | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [description, setDescription] = useState<string>("");

    useEffect(() => {
        const init = async () => {
            if (id) {
                try {
                    const res = await bookApi.getBookById(id);
                    if (res && res.data) {
                        setDataUpdate(res.data);

                        if (
                            res.data.bookImage &&
                            res.data.bookImage.length > 0
                        ) {
                            const imageList: UploadFile[] =
                                res.data.bookImage.map((img, index) => ({
                                    uid: `${index}`,
                                    name: img.imagePath,
                                    status: "done",
                                    url: `https://hai-project-images.s3.us-east-1.amazonaws.com/${img.imagePath}`,
                                }));
                            setFileList(imageList);
                        }

                        setDescription(res.data.description || "");

                        // Map nested objects to IDs for form fields
                        console.log("Raw book data:", res.data);
                        console.log("Categories from API:", res.data.category);

                        const categoryIds =
                            res.data.category?.map((c: any) => {
                                console.log("Mapping category:", c);
                                return c.id;
                            }) || [];

                        const formValues = {
                            ...res.data,
                            categories: categoryIds,
                            supplier: res.data.supplier?.id || undefined,
                        };

                        console.log("Setting form values:", formValues);
                        console.log("Categories IDs:", categoryIds);
                        form.setFieldsValue(formValues);
                    }
                } catch (error) {
                    console.error("Error fetching book:", error);
                    toast.error("Không thể tải thông tin sách!");
                }
            }
        };
        init();
        return () => form.resetFields();
    }, [id]);

    const onFinish = async (values: any) => {
        try {
            setIsUploading(true);
            let imageFileNames: string[] = [];

            // Upload new files if any
            const newFiles = fileList.filter((file) => file.originFileObj);
            if (newFiles.length > 0) {
                try {
                    const files = newFiles.map(
                        (file) => file.originFileObj as File
                    );
                    const uploadResponse = await fileApi.uploadFiles(
                        files,
                        "books"
                    );

                    if (uploadResponse.success && uploadResponse.data) {
                        imageFileNames = uploadResponse.data.map(
                            (file) => file.fileName
                        );
                    }
                } catch (uploadError: any) {
                    console.error("Upload error:", uploadError);
                    notification.error({
                        message: "Lỗi upload ảnh",
                        description:
                            uploadError.response?.data?.message ||
                            "Không thể upload ảnh. Vui lòng thử lại!",
                    });
                    setIsUploading(false);
                    return;
                }
            }

            const existingImages = fileList
                .filter((file) => !file.originFileObj && file.name)
                .map((file) => file.name);

            const allImages = [...existingImages, ...imageFileNames];

            const bookData: any = {
                isbn: values.isbn,
                title: values.title,
                author: values.author,
                yearOfPublication: values.yearOfPublication,
                shortDes: values.shortDes || "",
                description: description || "",
                sellingPrice: values.sellingPrice,
                importPrice: values.importPrice,
                status: values.status || "SALE",
                quantity: values.quantity,
                categories: values.categories
                    ? values.categories.map((catId: number) => ({ id: catId }))
                    : [],
                supplier: { id: values.supplier || 1 },
                inventory: { id: 1 },
            };

            // Only add image field if there are images
            if (allImages.length > 0) {
                bookData.image = allImages;
            }

            console.log("=== BOOK DATA DEBUG ===");
            console.log("Update mode:", !!dataUpdate?.id);
            console.log("Book ID:", dataUpdate?.id);
            console.log("Book data:", JSON.stringify(bookData, null, 2));
            console.log("All images:", allImages);

            if (dataUpdate?.id) {
                console.log("Calling updateBook with ID:", dataUpdate.id);
                console.log("Book data being sent:", bookData);
                const res = await bookApi.updateBook(dataUpdate.id, bookData);
                console.log("Update response:", res);

                if (res && res.success && res.data) {
                    message.success("Cập nhật sách thành công!");
                    setTimeout(() => {
                        navigate("/admin/books");
                    }, 500);
                } else {
                    notification.error({
                        message: "Có lỗi xảy ra",
                        description: res?.message || "Không thể cập nhật sách",
                    });
                }
            } else {
                console.log("Calling createBook");
                console.log("Book data being sent:", bookData);
                const res = await bookApi.createBook(bookData);
                console.log("Create response:", res);

                if (res && res.success && res.data) {
                    message.success("Tạo mới sách thành công!");
                    setTimeout(() => {
                        navigate("/admin/books");
                    }, 500);
                } else {
                    notification.error({
                        message: "Có lỗi xảy ra",
                        description: res?.message || "Không thể tạo sách",
                    });
                }
            }
        } catch (error: any) {
            console.error("Error saving book:", error);
            console.error("Error details:", error.response);

            // Xử lý validation errors từ backend (object)
            if (
                error.response?.data?.errors &&
                typeof error.response.data.errors === "object"
            ) {
                const validationErrors = error.response.data.errors;

                // Set errors directly on form fields
                const fieldErrors = Object.entries(validationErrors).map(
                    ([field, message]) => ({
                        name: field,
                        errors: [message as string],
                    })
                );
                form.setFields(fieldErrors);

                // Also show notification
                const errorMessages = Object.entries(validationErrors)
                    .map(([field, message]) => `• ${field}: ${message}`)
                    .join("\n");

                notification.error({
                    message: "Lỗi xác thực dữ liệu",
                    description: (
                        <div style={{ whiteSpace: "pre-line" }}>
                            {errorMessages}
                        </div>
                    ),
                    duration: 8,
                });
            }
            // Xử lý IdInvalidException (ISBN trùng, etc.) - errors là string
            else if (error.response?.data?.message) {
                notification.error({
                    message: error.response.data.message.includes("ISBN")
                        ? "ISBN đã tồn tại"
                        : "Có lỗi xảy ra",
                    description: error.response.data.message,
                    duration: 6,
                });

                // Nếu lỗi về ISBN, highlight field ISBN
                if (error.response.data.message.includes("ISBN")) {
                    form.setFields([
                        {
                            name: "isbn",
                            errors: [error.response.data.message],
                        },
                    ]);
                }
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description:
                        error.response?.data?.error ||
                        error.message ||
                        "Có lỗi xảy ra khi lưu sách!",
                });
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleUploadChange = ({ fileList: newFileList }: any) => {
        setFileList(newFileList);
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as File);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const getBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const uploadButton = (
        <div style={{ padding: "8px" }}>
            <PlusOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
            <div style={{ marginTop: 6, fontSize: "12px", color: "#666" }}>
                Tải ảnh
            </div>
        </div>
    );

    return (
        <AdminLayout>
            <div
                style={{
                    padding: "20px",
                    background: "#f0f2f5",
                    minHeight: "100vh",
                }}
            >
                {/* Compact Header */}
                <Card
                    bordered={false}
                    style={{
                        marginBottom: 16,
                        borderRadius: "8px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div>
                            <Breadcrumb
                                separator=">"
                                items={[
                                    {
                                        title: (
                                            <Link to="/admin/books">
                                                Quản lý sách
                                            </Link>
                                        ),
                                    },
                                    {
                                        title: dataUpdate?.id
                                            ? "Chỉnh sửa"
                                            : "Thêm mới",
                                    },
                                ]}
                            />
                            <Title level={4} style={{ margin: "8px 0 0 0" }}>
                                <BookOutlined style={{ marginRight: 8 }} />
                                {dataUpdate?.id
                                    ? "Chỉnh sửa sách"
                                    : "Thêm sách mới"}
                            </Title>
                        </div>
                    </div>
                </Card>

                <ProForm
                    form={form}
                    onFinish={onFinish}
                    submitter={{
                        searchConfig: {
                            resetText: "Hủy",
                            submitText: dataUpdate?.id
                                ? "Cập nhật sách"
                                : "Tạo mới sách",
                        },
                        onReset: () => navigate("/admin/books"),
                        render: (_: any, dom: any) => (
                            <FooterToolbar>{dom}</FooterToolbar>
                        ),
                        submitButtonProps: {
                            icon: <CheckSquareOutlined />,
                            loading: isUploading,
                        },
                    }}
                >
                    <Row gutter={16}>
                        {/* Left Column - Images */}
                        <Col span={24} lg={8}>
                            <Card
                                bordered={false}
                                style={{
                                    borderRadius: "8px",
                                    marginBottom: 16,
                                }}
                            >
                                <Title level={5} style={{ marginBottom: 12 }}>
                                    <PictureOutlined
                                        style={{ marginRight: 8 }}
                                    />
                                    Hình ảnh sách
                                </Title>
                                <Text
                                    type="secondary"
                                    style={{
                                        fontSize: "12px",
                                        display: "block",
                                        marginBottom: 12,
                                    }}
                                >
                                    Tải lên tối đa 8 ảnh
                                </Text>
                                <Form.Item style={{ marginBottom: 0 }}>
                                    <Upload
                                        listType="picture-card"
                                        fileList={fileList}
                                        onChange={handleUploadChange}
                                        onPreview={handlePreview}
                                        beforeUpload={() => false}
                                        accept="image/png,image/jpeg,image/jpg"
                                        multiple
                                        className="compact-upload"
                                    >
                                        {fileList.length >= 8
                                            ? null
                                            : uploadButton}
                                    </Upload>
                                </Form.Item>
                            </Card>
                        </Col>

                        {/* Right Column - All Form Fields */}
                        <Col span={24} lg={16}>
                            {/* Basic Info */}
                            <Card
                                bordered={false}
                                style={{
                                    borderRadius: "8px",
                                    marginBottom: 16,
                                }}
                            >
                                <Title level={5} style={{ marginBottom: 16 }}>
                                    <InfoCircleOutlined
                                        style={{ marginRight: 8 }}
                                    />
                                    Thông tin cơ bản
                                </Title>
                                <Row gutter={[16, 0]}>
                                    <Col span={24} md={12}>
                                        <ProFormText
                                            label="Tên sách"
                                            name="title"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng nhập tên sách!",
                                                },
                                            ]}
                                            placeholder="Nhập tên sách"
                                        />
                                    </Col>
                                    <Col span={24} md={12}>
                                        <ProFormText
                                            label="Tác giả"
                                            name="author"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng nhập tên tác giả!",
                                                },
                                            ]}
                                            placeholder="Nhập tên tác giả"
                                        />
                                    </Col>
                                    <Col span={24} md={8}>
                                        <ProFormText
                                            label="ISBN"
                                            name="isbn"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng nhập ISBN!",
                                                },
                                            ]}
                                            placeholder="978-3-16-148410-0"
                                        />
                                    </Col>
                                    <Col span={24} md={12}>
                                        <ProFormDigit
                                            label="Năm xuất bản"
                                            name="yearOfPublication"
                                            placeholder="2024"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng nhập năm xuất bản!",
                                                },
                                            ]}
                                            fieldProps={{
                                                min: 1900,
                                                max: new Date().getFullYear(),
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </Card>

                            {/* Pricing & Inventory */}
                            <Card
                                bordered={false}
                                style={{
                                    borderRadius: "8px",
                                    marginBottom: 16,
                                }}
                            >
                                <Title level={5} style={{ marginBottom: 16 }}>
                                    <DollarOutlined
                                        style={{ marginRight: 8 }}
                                    />
                                    Giá cả & Kho hàng
                                </Title>
                                <Row gutter={[16, 0]}>
                                    <Col span={24} md={6}>
                                        <ProFormDigit
                                            label="Giá nhập"
                                            name="importPrice"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng nhập giá nhập!",
                                                },
                                            ]}
                                            placeholder="0"
                                            fieldProps={{
                                                addonAfter: "₫",
                                                formatter: (value) =>
                                                    `${value}`.replace(
                                                        /\B(?=(\d{3})+(?!\d))/g,
                                                        ","
                                                    ),
                                                parser: (value) =>
                                                    +(value || "").replace(
                                                        /\$\s?|(,*)/g,
                                                        ""
                                                    ),
                                                min: 0,
                                            }}
                                        />
                                    </Col>
                                    <Col span={24} md={6}>
                                        <ProFormDigit
                                            label="Giá bán"
                                            name="sellingPrice"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng nhập giá bán!",
                                                },
                                            ]}
                                            placeholder="0"
                                            fieldProps={{
                                                addonAfter: "₫",
                                                formatter: (value) =>
                                                    `${value}`.replace(
                                                        /\B(?=(\d{3})+(?!\d))/g,
                                                        ","
                                                    ),
                                                parser: (value) =>
                                                    +(value || "").replace(
                                                        /\$\s?|(,*)/g,
                                                        ""
                                                    ),
                                                min: 0,
                                            }}
                                        />
                                    </Col>
                                    <Col span={24} md={6}>
                                        <ProFormDigit
                                            label="Số lượng"
                                            name="quantity"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng nhập số lượng!",
                                                },
                                            ]}
                                            placeholder="0"
                                            disabled={!!dataUpdate?.id}
                                            fieldProps={{
                                                min: 0,
                                            }}
                                        />
                                    </Col>
                                    <Col span={24} md={6}>
                                        <ProFormSelect
                                            name="status"
                                            label="Trạng thái"
                                            initialValue="SALE"
                                            disabled={!dataUpdate?.id}
                                            valueEnum={{
                                                SALE: "Đang bán",
                                                STOP_SALE: "Ngừng bán",
                                                OUT_STOCK: "Hết hàng",
                                            }}
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng chọn trạng thái!",
                                                },
                                            ]}
                                        />
                                    </Col>
                                </Row>
                            </Card>

                            {/* Categories & Supplier */}
                            <Card
                                bordered={false}
                                style={{
                                    borderRadius: "8px",
                                    marginBottom: 16,
                                }}
                            >
                                <Title level={5} style={{ marginBottom: 16 }}>
                                    <TagsOutlined style={{ marginRight: 8 }} />
                                    Phân loại & Nguồn cung cấp
                                </Title>
                                <Row gutter={[16, 0]}>
                                    <Col span={24} md={12}>
                                        <ProFormSelect
                                            name="categories"
                                            label="Thể loại"
                                            mode="multiple"
                                            options={CATEGORIES.map((cat) => ({
                                                label: `${cat.name} - ${cat.description}`,
                                                value: cat.id,
                                            }))}
                                            placeholder="Chọn thể loại sách"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng chọn ít nhất 1 thể loại!",
                                                },
                                            ]}
                                            fieldProps={{
                                                showSearch: true,
                                                filterOption: (input, option) =>
                                                    (option?.label ?? "")
                                                        .toLowerCase()
                                                        .includes(
                                                            input.toLowerCase()
                                                        ),
                                            }}
                                        />
                                    </Col>
                                    <Col span={24} md={12}>
                                        <ProFormSelect
                                            name="supplier"
                                            label="Nhà cung cấp"
                                            options={SUPPLIERS.map((sup) => ({
                                                label: `${sup.company_name} - ${sup.phone}`,
                                                value: sup.id,
                                            }))}
                                            placeholder="Chọn nhà cung cấp"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng chọn nhà cung cấp!",
                                                },
                                            ]}
                                            fieldProps={{
                                                showSearch: true,
                                                filterOption: (input, option) =>
                                                    (option?.label ?? "")
                                                        .toLowerCase()
                                                        .includes(
                                                            input.toLowerCase()
                                                        ),
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </Card>

                            {/* Description */}
                            <Card
                                bordered={false}
                                style={{
                                    borderRadius: "8px",
                                }}
                            >
                                <Title level={5} style={{ marginBottom: 16 }}>
                                    <FileTextOutlined
                                        style={{ marginRight: 8 }}
                                    />
                                    Mô tả sản phẩm
                                </Title>
                                <Row gutter={[16, 0]}>
                                    <Col span={24}>
                                        <ProFormTextArea
                                            label="Mô tả ngắn"
                                            name="shortDes"
                                            placeholder="Mô tả ngắn gọn (1-2 câu)"
                                            fieldProps={{
                                                rows: 2,
                                                maxLength: 1000,
                                                showCount: true,
                                            }}
                                        />
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label="Mô tả chi tiết"
                                            name="description"
                                            tooltip="Format văn bản với bold, italic, danh sách"
                                        >
                                            <div
                                                style={{
                                                    border: "1px solid #d9d9d9",
                                                    borderRadius: "6px",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                <RichTextEditor
                                                    value={description}
                                                    onChange={setDescription}
                                                    placeholder="Nhập mô tả chi tiết..."
                                                    style={{
                                                        height: "200px",
                                                        marginBottom: "50px",
                                                    }}
                                                />
                                            </div>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </ProForm>

                {/* Image Preview */}
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: "none" }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) =>
                                setPreviewOpen(visible),
                            afterOpenChange: (visible) =>
                                !visible && setPreviewImage(""),
                        }}
                        src={previewImage}
                    />
                )}

                <style>
                    {`
                    .compact-upload .ant-upload-select {
                        width: 104px !important;
                        height: 104px !important;
                        border-radius: 8px !important;
                        border: 2px dashed #d9d9d9 !important;
                    }
                    
                    .compact-upload .ant-upload-select:hover {
                        border-color: #1890ff !important;
                    }
                    
                    .compact-upload .ant-upload-list-picture-card-container {
                        width: 104px !important;
                        height: 104px !important;
                    }
                    
                    .ant-pro-form-group-title {
                        margin-bottom: 12px !important;
                    }
                    
                    .ant-form-item {
                        margin-bottom: 16px !important;
                    }
                    
                    .ant-tabs-tab {
                        padding: 8px 16px !important;
                    }
                `}
                </style>
            </div>
        </AdminLayout>
    );
};

export default ViewUpsertBook;
