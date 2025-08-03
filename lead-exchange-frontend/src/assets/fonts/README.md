# 字体资源目录

## 目录说明

此目录用于存放项目中使用的字体文件。

## 文件组织规范

### 目录结构

```
fonts/
├── primary/        # 主要字体
├── secondary/      # 辅助字体
└── icons/          # 图标字体
```

### 字体格式

- **WOFF2**: 现代浏览器首选格式
- **WOFF**: 兼容性格式
- **TTF**: 备用格式

### 命名规范

- 使用字体名称：`SourceSansPro-Regular.woff2`
- 包含字重信息：`Roboto-Bold.woff2`
- 包含样式信息：`OpenSans-Italic.woff2`

### 使用规范

- 在CSS中定义@font-face
- 提供字体回退方案
- 考虑字体加载性能
- 遵循字体许可协议
