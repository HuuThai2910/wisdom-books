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
    Divider,
    Space,
    Typography,
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
    DeleteOutlined,
    BookOutlined,
    DollarOutlined,
    FileTextOutlined,
    TagsOutlined,
    PictureOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import RichTextEditor from "../../components/common/RichTextEditor";
import bookApi from "../../api/bookApi";
import fileApi from "../../api/fileApi";
import { Book } from "../../types";
import toast from "react-hot-toast";
import { SUPPLIERS, CATEGORIES } from "../../data/bookData";

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

                        // Convert bookImage to fileList
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
                        form.setFieldsValue({
                            ...res.data,
                        });
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

            // Upload new images
            const newFiles = fileList.filter((file) => file.originFileObj);
            if (newFiles.length > 0) {
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
            }

            // Keep existing images
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
                status: values.status,
                quantity: values.quantity,
                publisher: values.publisher || "",
                image: allImages.length > 0 ? allImages : undefined,
                categories: values.categories
                    ? values.categories.map((catId: number) => ({ id: catId }))
                    : [],
                supplier: { id: values.supplier || 1 },
                inventory: { id: 1 },
            };

            if (dataUpdate?.id) {
                // Update
                const res = await bookApi.updateBook(dataUpdate.id, bookData);
                if (res.data) {
                    message.success("Cập nhật sách thành công");
                    navigate("/admin/books");
                } else {
                    notification.error({
                        message: "Có lỗi xảy ra",
                        description: res.message || "Không thể cập nhật sách",
                    });
                }
            } else {
                // Create
                const res = await bookApi.createBook(bookData);
                if (res.data) {
                    message.success("Tạo mới sách thành công");
                    navigate("/admin/books");
                } else {
                    notification.error({
                        message: "Có lỗi xảy ra",
                        description: res.message || "Không thể tạo sách",
                    });
                }
            }
        } catch (error: any) {
            console.error("Error saving book:", error);
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    error.response?.data?.message ||
                    error.message ||
                    "Có lỗi xảy ra!",
            });
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
            <PlusOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
            <div style={{ marginTop: 8, fontSize: "13px", color: "#666" }}>
                Tải ảnh lên
            </div>
        </div>
    );

    return (
        <div
            style={{
                padding: "24px",
                background: "#f0f2f5",
                minHeight: "100vh",
            }}
        >
            {/* Header Section */}
            <Card
                bordered={false}
                style={{
                    marginBottom: 24,
                    borderRadius: "8px",
                    boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)",
                }}
            >
                <Space direction="vertical" size={4} style={{ width: "100%" }}>
                    <Breadcrumb
                        separator=">"
                        items={[
                            {
                                title: (
                                    <Link to="/admin/books">Quản lý sách</Link>
                                ),
                            },
                            {
                                title: dataUpdate?.id
                                    ? "Chỉnh sửa sách"
                                    : "Thêm sách mới",
                            },
                        ]}
                    />
                    <Title level={3} style={{ margin: "8px 0 0 0" }}>
                        <BookOutlined style={{ marginRight: 8 }} />
                        {dataUpdate?.id ? "Chỉnh sửa sách" : "Thêm sách mới"}
                    </Title>
                    <Text type="secondary">
                        {dataUpdate?.id
                            ? "Cập nhật thông tin chi tiết của sách"
                            : "Nhập đầy đủ thông tin để thêm sách mới vào hệ thống"}
                    </Text>
                </Space>
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
                        <FooterToolbar
                            style={{
                                boxShadow: "0 -2px 8px rgba(0,0,0,0.08)",
                            }}
                        >
                            {dom}
                        </FooterToolbar>
                    ),
                    submitButtonProps: {
                        icon: <CheckSquareOutlined />,
                        loading: isUploading,
                        size: "large",
                    },
                    resetButtonProps: {
                        size: "large",
                    },
                }}
            >
                <Row gutter={[24, 24]}>
                    {/* Upload Images Section */}
                    <Col span={24}>
                        <Card
                            bordered={false}
                            style={{
                                borderRadius: "8px",
                                boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)",
                            }}
                        >
                            <Space
                                direction="vertical"
                                size={16}
                                style={{ width: "100%" }}
                            >
                                <div>
                                    <Title level={5} style={{ margin: 0 }}>
                                        <PictureOutlined
                                            style={{ marginRight: 8 }}
                                        />
                                        Hình ảnh sách
                                    </Title>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: "13px" }}
                                    >
                                        Tải lên tối đa 8 ảnh (JPG, PNG). Ảnh đầu
                                        tiên sẽ là ảnh đại diện
                                    </Text>
                                </div>
                                <Form.Item style={{ marginBottom: 0 }}>
                                    <Upload
                                        listType="picture-card"
                                        fileList={fileList}
                                        onChange={handleUploadChange}
                                        onPreview={handlePreview}
                                        beforeUpload={() => false}
                                        accept="image/png,image/jpeg,image/jpg"
                                        multiple
                                        className="book-upload"
                                    >
                                        {fileList.length >= 8
                                            ? null
                                            : uploadButton}
                                    </Upload>
                                </Form.Item>
                            </Space>
                        </Card>
                    </Col>

                    {/* Basic Information */}
                    <Col span={24}>
                        <Card
                            bordered={false}
                            style={{
                                borderRadius: "8px",
                                boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)",
                            }}
                        >
                            <Title level={5} style={{ marginBottom: 20 }}>
                                <BookOutlined style={{ marginRight: 8 }} />
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
                                        fieldProps={{
                                            size: "large",
                                        }}
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
                                        fieldProps={{
                                            size: "large",
                                        }}
                                    />
                                </Col>

                                <Col span={24} md={8}>
                                    <ProFormText
                                        label="ISBN"
                                        name="isbn"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng nhập ISBN!",
                                            },
                                        ]}
                                        placeholder="Ví dụ: 978-3-16-148410-0"
                                        fieldProps={{
                                            size: "large",
                                        }}
                                    />
                                </Col>

                                <Col span={24} md={8}>
                                    <ProFormText
                                        label="Nhà xuất bản"
                                        name="publisher"
                                        placeholder="Nhập nhà xuất bản"
                                        fieldProps={{
                                            size: "large",
                                        }}
                                    />
                                </Col>

                                <Col span={24} md={8}>
                                    <ProFormDigit
                                        label="Năm xuất bản"
                                        name="yearOfPublication"
                                        placeholder="Nhập năm xuất bản"
                                        fieldProps={{
                                            min: 1900,
                                            max: new Date().getFullYear(),
                                            size: "large",
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    {/* Pricing & Inventory */}
                    <Col span={24}>
                        <Card
                            bordered={false}
                            style={{
                                borderRadius: "8px",
                                boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)",
                            }}
                        >
                            <Title level={5} style={{ marginBottom: 20 }}>
                                <DollarOutlined style={{ marginRight: 8 }} />
                                Giá cả & Kho hàng
                            </Title>
                            <Row gutter={[16, 0]}>
                                <Col span={24} md={8}>
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
                                        placeholder="Nhập giá nhập"
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
                                            size: "large",
                                        }}
                                    />
                                </Col>

                                <Col span={24} md={8}>
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
                                        placeholder="Nhập giá bán"
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
                                            size: "large",
                                        }}
                                    />
                                </Col>

                                <Col span={24} md={8}>
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
                                        placeholder="Nhập số lượng"
                                        fieldProps={{
                                            min: 0,
                                            size: "large",
                                        }}
                                    />
                                </Col>

                                <Col span={24} md={8}>
                                    <ProFormSelect
                                        name="status"
                                        label="Trạng thái"
                                        valueEnum={{
                                            SALE: "Đang bán",
                                            STOP: "Ngừng bán",
                                            OUT_OF_STOCK: "Hết hàng",
                                        }}
                                        placeholder="Chọn trạng thái"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng chọn trạng thái!",
                                            },
                                        ]}
                                        fieldProps={{
                                            size: "large",
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    {/* Categories & Supplier */}
                    <Col span={24}>
                        <Card
                            bordered={false}
                            style={{
                                borderRadius: "8px",
                                boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)",
                            }}
                        >
                            <Title level={5} style={{ marginBottom: 20 }}>
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
                                            size: "large",
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
                                        initialValue={1}
                                        fieldProps={{
                                            showSearch: true,
                                            filterOption: (input, option) =>
                                                (option?.label ?? "")
                                                    .toLowerCase()
                                                    .includes(
                                                        input.toLowerCase()
                                                    ),
                                            size: "large",
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    {/* Descriptions */}
                    <Col span={24}>
                        <Card
                            bordered={false}
                            style={{
                                borderRadius: "8px",
                                boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)",
                            }}
                        >
                            <Title level={5} style={{ marginBottom: 20 }}>
                                <FileTextOutlined style={{ marginRight: 8 }} />
                                Mô tả sản phẩm
                            </Title>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <ProFormTextArea
                                        label="Mô tả ngắn"
                                        name="shortDes"
                                        placeholder="Mô tả ngắn gọn về sách (1-2 câu) - Hiển thị trong danh sách sản phẩm"
                                        fieldProps={{
                                            rows: 3,
                                            maxLength: 200,
                                            showCount: true,
                                            size: "large",
                                        }}
                                    />
                                </Col>

                                <Col span={24}>
                                    <Form.Item
                                        label="Mô tả chi tiết"
                                        name="description"
                                        tooltip="Sử dụng thanh công cụ để format văn bản với bold, italic, danh sách, v.v."
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
                                                placeholder="Nhập mô tả chi tiết về nội dung sách, tác giả, điểm nổi bật..."
                                                style={{
                                                    height: "300px",
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

            {/* Image Preview Modal */}
            {previewImage && (
                <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) =>
                            !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                />
            )}

            <style>
                {`
                    .book-upload .ant-upload-select {
                        width: 128px !important;
                        height: 128px !important;
                        border-radius: 8px !important;
                        border: 2px dashed #d9d9d9 !important;
                        transition: all 0.3s ease !important;
                    }
                    
                    .book-upload .ant-upload-select:hover {
                        border-color: #1890ff !important;
                        background: #f0f5ff !important;
                    }
                    
                    .book-upload .ant-upload-list-picture-card-container {
                        width: 128px !important;
                        height: 128px !important;
                    }
                    
                    .book-upload .ant-upload-list-item {
                        border-radius: 8px !important;
                    }
                    
                    .ant-card {
                        transition: all 0.3s ease;
                    }
                    
                    .ant-card:hover {
                        box-shadow: 0 4px 12px 0 rgba(0,0,0,0.05) !important;
                    }
                `}
            </style>
        </div>
    );
};

export default ViewUpsertBook;