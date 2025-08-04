# 招商线索流通Web应用后端服务

## 项目简介

招商线索流通Web应用后端服务，基于Spring Boot 2.7.x构建，采用模块化单体架构设计，支持线索管理、用户管理、评级引擎、交换引擎、数据分析和通知服务等核心功能。

## 技术栈

- **应用框架**: Spring Boot 2.7.18
- **安全框架**: Spring Security 5.7.x
- **数据访问**: Spring Data JPA 2.7.x + MyBatis Plus 3.5.x
- **缓存**: Redis 6.x
- **消息队列**: RabbitMQ 3.9.x
- **搜索引擎**: Elasticsearch 7.x
- **数据库**: MySQL 8.0.x
- **连接池**: Druid 1.2.16
- **JWT**: JJWT 0.11.5
- **工具类**: Hutool 5.8.16
- **JSON**: FastJSON 2.0.25

## 项目结构

```
lead-exchange-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── leadexchange/
│   │   │           ├── LeadExchangeApplication.java     # 主启动类
│   │   │           ├── common/                          # 通用模块
│   │   │           │   ├── config/                     # 配置类
│   │   │           │   ├── result/                     # 响应结果
│   │   │           │   ├── exception/                  # 异常处理
│   │   │           │   └── utils/                      # 工具类
│   │   │           └── modules/                        # 业务模块
│   │   │               ├── user/                       # 用户管理模块
│   │   │               ├── lead/                       # 线索管理模块
│   │   │               ├── rating/                     # 评级引擎模块
│   │   │               ├── exchange/                   # 交换引擎模块
│   │   │               ├── analytics/                  # 数据分析模块
│   │   │               └── notification/               # 通知服务模块
│   │   └── resources/
│   │       ├── application.yml                         # 主配置文件
│   │       ├── application-dev.yml                     # 开发环境配置
│   │       ├── application-prod.yml                    # 生产环境配置
│   │       └── mapper/                                 # MyBatis映射文件
│   └── test/                                           # 测试代码
├── pom.xml                                             # Maven配置文件
└── README.md                                           # 项目说明文档
```

## 核心模块说明

### 1. 用户管理模块 (User Management)
- 用户注册、登录、权限管理
- 基于RBAC的角色权限控制
- JWT令牌认证

### 2. 线索管理模块 (Lead Management)
- 线索创建、编辑、查询
- 线索状态管理
- 重复检测算法

### 3. 评级引擎模块 (Rating Engine)
- A/B/C/D四级评级算法
- 基于信息完整度、企业资质评级
- 动态评级调整

### 4. 交换引擎模块 (Exchange Engine)
- 线索价值计算
- 自动匹配交换
- 交换流程管理

### 5. 数据分析模块 (Analytics)
- 线索统计分析
- 交换数据分析
- 用户行为分析

### 6. 通知服务模块 (Notification)
- 站内信通知
- 短信/邮件通知
- 事件驱动通知

## 环境要求

- **JDK**: 11 或更高版本
- **Maven**: 3.6 或更高版本
- **MySQL**: 8.0 或更高版本
- **Redis**: 6.0 或更高版本
- **RabbitMQ**: 3.9 或更高版本
- **Elasticsearch**: 7.x 版本

## 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd lead-exchange-backend
```

### 2. 配置数据库
创建MySQL数据库：
```sql
CREATE DATABASE lead_exchange CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 修改配置
编辑 `src/main/resources/application.yml` 文件，修改数据库连接信息：
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/lead_exchange?useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=true&serverTimezone=GMT%2B8
    username: your_username
    password: your_password
```

### 4. 启动依赖服务
确保以下服务已启动：
- MySQL 数据库
- Redis 服务
- RabbitMQ 服务
- Elasticsearch 服务

### 5. 编译运行
```bash
# 编译项目
mvn clean compile

# 运行项目
mvn spring-boot:run
```

### 6. 访问应用
- 应用地址: http://localhost:8080/api
- Druid监控: http://localhost:8080/api/druid
- 健康检查: http://localhost:8080/api/actuator/health

## 开发规范

### 代码规范
- 使用驼峰命名法
- 所有公共方法必须添加中文注释
- 遵循RESTful API设计规范
- 统一异常处理和响应格式

### 数据库规范
- 表名使用下划线命名法
- 统一使用Long类型自增主键
- 必须包含创建时间和更新时间字段
- 重要数据采用软删除

### 安全规范
- 所有API接口必须进行权限验证
- 敏感数据必须加密存储
- 关键操作必须记录审计日志

## 部署说明

### 打包部署
```bash
# 打包项目
mvn clean package -DskipTests

# 运行jar包
java -jar target/lead-exchange-backend-1.0.0.jar
```

### Docker部署
```bash
# 构建镜像
docker build -t lead-exchange-backend:1.0.0 .

# 运行容器
docker run -d -p 8080:8080 --name lead-exchange-backend lead-exchange-backend:1.0.0
```

## 监控和日志

- **应用监控**: 通过Actuator端点监控应用状态
- **数据库监控**: 通过Druid监控数据库连接池
- **日志管理**: 日志文件位于 `logs/lead-exchange-backend.log`

## 联系方式

- 项目负责人: 系统开发团队
- 技术支持: 请提交Issue或联系开发团队

## 版本历史

- **v1.0.0** (2024-01-01): 项目初始化，完成基础架构搭建