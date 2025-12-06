import { useState, useEffect, useCallback } from "react";
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
    Modal,
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
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import RichTextEditor from "../../components/common/RichTextEditor";
import bookApi from "../../api/bookApi";
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
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingValues, setPendingValues] = useState<any>(null);

    const handleDescriptionChange = useCallback((value: string) => {
        console.log("Description changed to:", value);
        setDescription(value);
    }, []);

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
                        } else {
                            setFileList([]);
                        }

                        const descriptionValue = res.data.description || "";
                        console.log(
                            "Loading description from API:",
                            descriptionValue
                        );
                        setDescription(descriptionValue);

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
            } else {
                // Reset khi tạo mới
                setDataUpdate(null);
                setFileList([]);
                setDescription("");
            }
        };
        init();
        return () => form.resetFields();
    }, [id]);

    const handleFormSubmit = async (values: any) => {
        setPendingValues(values);
        setShowConfirmModal(true);
    };

    const handleConfirmSubmit = async () => {
        setShowConfirmModal(false);
        if (pendingValues) {
            await onFinish(pendingValues);
        }
    };

    const onFinish = async (values: any) => {
        try {
            setIsUploading(true);

            // Get new files to upload AFTER creating/updating book
            const newFiles = fileList.filter((file) => file.originFileObj);
            const newFileObjects = newFiles.map(
                (file) => file.originFileObj as File
            );

            const existingImages = fileList
                .filter((file) => !file.originFileObj && file.name)
                .map((file) => file.name);

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
                categoryIds:
                    values.categories && values.categories.length > 0
                        ? values.categories
                        : [],
                supplierId: values.supplier || null,
                inventoryId: 1,
            };

            console.log("Book data being sent:", bookData);
            console.log("Categories:", values.categories);
            console.log("Supplier:", values.supplier);
            console.log("Description state:", description);
            console.log("ShortDes from form:", values.shortDes);
            console.log("FileList:", fileList);
            console.log("Existing images:", existingImages);
            console.log("New files:", newFiles);
            console.log("New file objects:", newFileObjects);

            // Xử lý ảnh
            if (!dataUpdate?.id) {
                // Tạo mới: validate frontend và gửi placeholder
                // Backend sẽ nhận lỗi validation nếu mảng rỗng
                bookData.image = fileList.length > 0 ? ["placeholder.jpg"] : [];
            } else {
                // Update:
                // - Nếu có ảnh cũ: gửi ảnh cũ
                // - Nếu không có ảnh cũ nhưng có ảnh mới: gửi placeholder
                // - Ảnh mới sẽ được upload sau và thay thế placeholder
                if (existingImages.length > 0) {
                    bookData.image = existingImages;
                } else if (newFileObjects.length > 0) {
                    // Gửi placeholder để pass validation, sẽ được thay thế bằng ảnh thật
                    bookData.image = ["placeholder.jpg"];
                } else {
                    // Không có ảnh nào
                    bookData.image = [];
                }
            }

            if (dataUpdate?.id) {
                const res = await bookApi.updateBook(dataUpdate.id, bookData);

                if (res && res.success && res.data) {
                    console.log(
                        "Book updated successfully, now uploading new images..."
                    );

                    // Upload new images to S3 after update
                    if (newFileObjects.length > 0) {
                        try {
                            console.log(
                                `Uploading ${newFileObjects.length} new images to S3...`
                            );
                            const uploadResult = await bookApi.uploadBookImages(
                                dataUpdate.id,
                                newFileObjects
                            );
                            console.log("Upload result:", uploadResult);
                            console.log(
                                `Successfully uploaded ${newFileObjects.length} images to S3`
                            );
                        } catch (uploadError) {
                            console.error("Upload error:", uploadError);
                            notification.warning({
                                message:
                                    "Cập nhật sách thành công nhưng upload ảnh thất bại",
                                description: "Vui lòng thử upload lại sau.",
                            });
                            return; // Dừng lại, không navigate
                        }
                    } else {
                        console.log("No new images to upload");
                    }
                    message.success("Cập nhật sách thành công!");
                    navigate("/admin/books");
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
                    const newBookId = res.data.id;

                    // Upload new images to S3 after creating book
                    if (newFileObjects.length > 0) {
                        try {
                            await bookApi.uploadBookImages(
                                newBookId,
                                newFileObjects
                            );
                            console.log(
                                `Uploaded ${newFileObjects.length} images to S3 for book ${newBookId}`
                            );
                        } catch (uploadError) {
                            console.error("Upload error:", uploadError);
                            notification.warning({
                                message:
                                    "Tạo sách thành công nhưng upload ảnh thất bại",
                                description: "Vui lòng thử upload lại sau.",
                            });
                        }
                    }

                    message.success("Tạo mới sách thành công!");
                    navigate("/admin/books");
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

            // Xử lý validation errors từ backend (object) - ví dụ: {yearOfPublication: "...", image: "..."}
            if (
                error.response?.data?.errors &&
                typeof error.response.data.errors === "object"
            ) {
                const validationErrors = error.response.data.errors;

                // Map backend field names to form field names
                const fieldNameMap: Record<string, string> = {
                    categoryIds: "categories",
                    supplierId: "supplier",
                };

                // Set errors directly on form fields
                const fieldErrors = Object.entries(validationErrors).map(
                    ([field, message]) => ({
                        name: fieldNameMap[field] || field, // Use mapped name or original
                        errors: [message as string],
                    })
                );

                console.log("Setting field errors:", fieldErrors);
                form.setFields(fieldErrors);

                // Scroll to first error field
                const firstErrorField = fieldErrors[0]?.name;
                if (firstErrorField) {
                    form.scrollToField(firstErrorField);
                }

                // Show all validation errors
                const errorMessages = Object.entries(validationErrors)
                    .map(([field, message]) => {
                        const fieldLabel =
                            field === "yearOfPublication"
                                ? "Năm xuất bản"
                                : field === "image"
                                ? "Hình ảnh"
                                : field === "isbn"
                                ? "ISBN"
                                : field === "title"
                                ? "Tên sách"
                                : field === "author"
                                ? "Tác giả"
                                : field === "categoryIds"
                                ? "Thể loại"
                                : field === "supplierId"
                                ? "Nhà cung cấp"
                                : field === "sellingPrice"
                                ? "Giá bán"
                                : field === "importPrice"
                                ? "Giá nhập"
                                : field === "quantity"
                                ? "Số lượng"
                                : field;
                        return `• ${fieldLabel}: ${message}`;
                    })
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

                // Also show toast for quick visibility
                toast.error("Vui lòng kiểm tra lại thông tin!");
            }
            // Xử lý error message trực tiếp từ backend (string)
            else if (error.response?.data?.message) {
                const errorMessage = error.response.data.message;

                notification.error({
                    message: errorMessage.includes("ISBN")
                        ? "ISBN đã tồn tại"
                        : errorMessage.includes("ảnh") ||
                          errorMessage.includes("image")
                        ? "Lỗi hình ảnh"
                        : errorMessage.includes("năm") ||
                          errorMessage.includes("year")
                        ? "Lỗi năm xuất bản"
                        : "Có lỗi xảy ra",
                    description: errorMessage,
                    duration: 6,
                });

                // Highlight field tương ứng
                if (errorMessage.includes("ISBN")) {
                    form.setFields([
                        {
                            name: "isbn",
                            errors: [errorMessage],
                        },
                    ]);
                } else if (
                    errorMessage.includes("năm") ||
                    errorMessage.includes("year")
                ) {
                    form.setFields([
                        {
                            name: "yearOfPublication",
                            errors: [errorMessage],
                        },
                    ]);
                }

                toast.error(errorMessage);
            } else {
                const errorMsg =
                    error.response?.data?.error ||
                    error.message ||
                    "Có lỗi xảy ra khi lưu sách!";

                notification.error({
                    message: "Có lỗi xảy ra",
                    description: errorMsg,
                });

                toast.error(errorMsg);
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleUploadChange = ({ fileList: newFileList }: any) => {
        console.log("Upload change - received fileList:", newFileList);

        // Validate số lượng ảnh
        if (newFileList.length > 8) {
            toast.error("Số lượng ảnh không được vượt quá 8!");
            return;
        }

        setFileList(newFileList);
    };

    const handleBeforeUpload = (file: File) => {
        // Chỉ validate, không thêm file vào state
        // Upload component sẽ tự động thêm file và trigger onChange
        if (fileList.length >= 8) {
            toast.error("Số lượng ảnh không được vượt quá 8!");
            return Upload.LIST_IGNORE; // Ignore this file
        }
        return false; // Prevent actual upload, just add to list
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
                    padding: "5px",
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
                    onFinish={handleFormSubmit}
                    submitter={{
                        searchConfig: {
                            resetText: "Hủy",
                            submitText: dataUpdate?.id
                                ? "Cập nhật sách"
                                : "Tạo mới sách",
                        },
                        onReset: () => navigate("/admin/books"),
                        submitButtonProps: {
                            icon: <CheckSquareOutlined />,
                            loading: isUploading,
                            style: {
                                borderRadius: "8px",
                                height: "40px",
                                fontSize: "15px",
                                fontWeight: "600",
                            },
                        },
                        resetButtonProps: {
                            style: {
                                borderRadius: "8px",
                                height: "40px",
                                fontSize: "15px",
                                fontWeight: "600",
                            },
                        },
                        render: (_: any, dom: any) => (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: "12px",
                                    padding: "24px 0",
                                    marginTop: "24px",
                                    borderTop: "1px solid #f0f0f0",
                                }}
                            >
                                {dom}
                            </div>
                        ),
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
                                <Form.Item
                                    name="image"
                                    style={{ marginBottom: 0 }}
                                >
                                    <Upload
                                        listType="picture-card"
                                        fileList={fileList}
                                        onChange={handleUploadChange}
                                        onPreview={handlePreview}
                                        beforeUpload={handleBeforeUpload}
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
                                            placeholder="Nhập tên sách"
                                        />
                                    </Col>
                                    <Col span={24} md={12}>
                                        <ProFormText
                                            label="Tác giả"
                                            name="author"
                                            placeholder="Nhập tên tác giả"
                                        />
                                    </Col>
                                    <Col span={24} md={8}>
                                        <ProFormText
                                            label="ISBN"
                                            name="isbn"
                                            placeholder="978-3-16-148410-0"
                                        />
                                    </Col>
                                    <Col span={24} md={12}>
                                        <ProFormDigit
                                            label="Năm xuất bản"
                                            name="yearOfPublication"
                                            placeholder="2024"
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
                                            }}
                                        />
                                    </Col>
                                    <Col span={24} md={6}>
                                        <ProFormDigit
                                            label="Giá bán"
                                            name="sellingPrice"
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
                                            }}
                                        />
                                    </Col>
                                    <Col span={24} md={6}>
                                        <ProFormDigit
                                            label="Số lượng"
                                            name="quantity"
                                            placeholder="0"
                                            disabled={!!dataUpdate?.id}
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
                                                    onChange={
                                                        handleDescriptionChange
                                                    }
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

                {/* Confirmation Modal */}
                <Modal
                    open={showConfirmModal}
                    onCancel={() => setShowConfirmModal(false)}
                    footer={null}
                    centered
                    width={480}
                    closeIcon={
                        <span className="text-gray-400 hover:text-gray-600 text-xl">
                            ×
                        </span>
                    }
                >
                    <div className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <ExclamationCircleOutlined className="text-2xl text-blue-600" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Xác nhận{" "}
                                    {dataUpdate?.id ? "cập nhật" : "tạo mới"}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Bạn có chắc chắn muốn{" "}
                                    {dataUpdate?.id ? "cập nhật" : "tạo"} cuốn
                                    sách{" "}
                                    <span className="font-semibold text-gray-900">
                                        "{pendingValues?.title}"
                                    </span>{" "}
                                    không?
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() =>
                                            setShowConfirmModal(false)
                                        }
                                        className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleConfirmSubmit}
                                        className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <CheckSquareOutlined />
                                        Xác nhận
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </AdminLayout>
    );
};

export default ViewUpsertBook;
