# GitHub Secrets Setup Guide

## Cần thiết lập các Secrets sau trong GitHub Repository

Vào: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### Required Secrets

#### 1. EC2_HOST

```
18.141.4.147
```

IP hoặc domain của EC2 instance

#### 2. EC2_USER

```
ubuntu
```

Username SSH (ubuntu cho Ubuntu AMI, ec2-user cho Amazon Linux)

#### 3. EC2_SSH_KEY

```
-----BEGIN RSA PRIVATE KEY-----
(Paste toàn bộ nội dung file AWS-EC2.pem)
-----END RSA PRIVATE KEY-----
```

Private key để SSH vào EC2 (nội dung file `.pem`)

---

## Cách lấy nội dung SSH Key

### Windows:

```bash
cat AWS-EC2.pem
```

### Copy toàn bộ output và paste vào Secret

---

## Optional Secrets (cho workflow khác)

### AWS_ACCESS_KEY_ID

Access key của AWS IAM user (nếu cần deploy S3, ECS, etc.)

### AWS_SECRET_ACCESS_KEY

Secret key của AWS IAM user

---

## Test Workflow

Sau khi setup xong secrets:

1. **Commit & Push** code lên branch `develop` hoặc `main`
2. Vào tab **Actions** trong GitHub repo
3. Xem workflow **Deploy to EC2** đang chạy
4. Kiểm tra logs để đảm bảo deploy thành công

---

## Trigger Deploy Thủ Công

1. Vào tab **Actions**
2. Chọn workflow **Deploy to EC2**
3. Click **Run workflow**
4. Chọn branch và click **Run**

---

## Troubleshooting

### ❌ SSH Connection Failed

-   Kiểm tra Security Group EC2 đã mở port 22 cho GitHub Actions IPs
-   Verify EC2_SSH_KEY đúng format (có BEGIN/END RSA PRIVATE KEY)

### ❌ Permission Denied

-   Đảm bảo user `wisdom` và thư mục `/opt/wisdom-books` tồn tại trên EC2
-   Chạy lại `scripts/ec2_bootstrap.sh`

### ❌ Service Failed to Start

-   SSH vào EC2: `ssh -i AWS-EC2.pem ubuntu@18.141.4.147`
-   Xem logs: `sudo journalctl -u wisdom-books -n 100`
-   Kiểm tra env: `cat /etc/wisdom-books.env`
