# 颜色系统使用指南

## 概述
本项目使用了一套完整的颜色系统，支持浅色和深色模式，包含主色调、功能色、状态色等多种颜色类型。

## 主色调 (Primary)
- **主色**: `#4A90E2` - 用于主要按钮、链接、重要元素
- **悬停色**: `#357ABD` - 主色按钮的悬停状态
- **浅色**: `#B3D4F2` - 用于背景、边框等
- **深色**: `#2E5A8A` - 用于强调、阴影等

### 使用示例
```html
<!-- 主要按钮 -->
<button class="btn-primary">主要操作</button>

<!-- 使用 Tailwind 类 -->
<div class="bg-primary text-primary-foreground">主色背景</div>
<div class="bg-primary-hover">悬停状态</div>
<div class="bg-primary-light">浅色背景</div>
<div class="bg-primary-dark">深色背景</div>
```

## 次要色调 (Secondary)
- **次要色**: `#F5F7FA` - 用于次要按钮、卡片背景
- **悬停色**: `#E8ECF0` - 次要按钮的悬停状态

### 使用示例
```html
<button class="btn-secondary">次要操作</button>
<div class="bg-secondary text-secondary-foreground">次要背景</div>
```

## 状态颜色

### 成功色 (Success)
- **成功色**: `#48BB78` - 用于成功状态、确认操作
- **悬停色**: `#38A169` - 成功按钮的悬停状态

### 警告色 (Warning)
- **警告色**: `#ED8936` - 用于警告状态、注意提示
- **悬停色**: `#DD6B20` - 警告按钮的悬停状态

### 错误色 (Destructive)
- **错误色**: `#F56565` - 用于错误状态、删除操作
- **悬停色**: `#E53E3E` - 错误按钮的悬停状态

### 信息色 (Info)
- **信息色**: `#4299E1` - 用于信息提示、帮助说明
- **悬停色**: `#3182CE` - 信息按钮的悬停状态

### 使用示例
```html
<!-- 状态按钮 -->
<button class="btn-success">成功操作</button>
<button class="btn-warning">警告操作</button>
<button class="btn-destructive">删除操作</button>

<!-- 使用 Tailwind 类 -->
<div class="bg-success text-success-foreground">成功状态</div>
<div class="bg-warning text-warning-foreground">警告状态</div>
<div class="bg-destructive text-destructive-foreground">错误状态</div>
```

## 文本颜色

### 主要文本
- **深色文本**: `#1a202c` - 主要文本内容
- **浅色文本**: `#4a5568` - 次要文本内容
- **静音文本**: `#718096` - 辅助文本、占位符

### 使用示例
```html
<h1 class="text-foreground">主要标题</h1>
<p class="text-muted-foreground">次要文本</p>
<span class="text-text-color-muted">辅助信息</span>
```

## 边框和输入框

### 边框颜色
- **边框色**: `#e2e8f0` - 默认边框
- **悬停边框**: `#cbd5e0` - 悬停状态的边框

### 输入框
- **输入框**: `#e2e8f0` - 默认输入框边框
- **悬停状态**: `#d1d5db` - 输入框悬停边框
- **聚焦状态**: `#4A90E2` - 输入框聚焦边框

### 使用示例
```html
<!-- 输入框 -->
<input class="input" placeholder="请输入内容" />

<!-- 边框 -->
<div class="border border-border">带边框的容器</div>
<div class="border border-border-hover">悬停边框</div>
```

## 卡片和弹出层

### 卡片
- **卡片背景**: 白色 (浅色模式) / `#2D3748` (深色模式)
- **卡片文字**: `#1a202c` (浅色模式) / 白色 (深色模式)

### 使用示例
```html
<div class="card p-4">
  <h3 class="text-card-foreground">卡片标题</h3>
  <p class="text-muted-foreground">卡片内容</p>
</div>
```

## 徽章 (Badge)

### 使用示例
```html
<span class="badge badge-primary">主要徽章</span>
<span class="badge badge-secondary">次要徽章</span>
<span class="badge badge-success">成功徽章</span>
<span class="badge badge-warning">警告徽章</span>
<span class="badge badge-destructive">错误徽章</span>
```

## 图表颜色

### 图表色板
- **图表1**: 红色系 - 用于数据可视化
- **图表2**: 青色系 - 用于数据可视化
- **图表3**: 深蓝系 - 用于数据可视化
- **图表4**: 黄色系 - 用于数据可视化
- **图表5**: 橙色系 - 用于数据可视化
- **图表6**: 主色调 - 用于数据可视化
- **图表7**: 绿色系 - 用于数据可视化
- **图表8**: 紫色系 - 用于数据可视化

### 使用示例
```html
<div class="bg-chart-1">图表颜色1</div>
<div class="bg-chart-2">图表颜色2</div>
<div class="bg-chart-3">图表颜色3</div>
```

## 阴影系统

### 阴影等级
- **小阴影**: `shadow-sm` - 轻微阴影
- **大阴影**: `shadow-lg` - 中等阴影
- **超大阴影**: `shadow-xl` - 大阴影
- **最大阴影**: `shadow-2xl` - 最大阴影

### 使用示例
```html
<div class="shadow-sm">轻微阴影</div>
<div class="shadow-lg">中等阴影</div>
<div class="shadow-xl">大阴影</div>
<div class="shadow-2xl">最大阴影</div>
```

## 圆角系统

### 圆角等级
- **小圆角**: `rounded-sm` - 4px
- **中圆角**: `rounded-md` - 6px
- **大圆角**: `rounded-lg` - 8px
- **超大圆角**: `rounded-xl` - 12px
- **最大圆角**: `rounded-2xl` - 16px
- **全圆角**: `rounded-full` - 50%

### 使用示例
```html
<div class="rounded-sm">小圆角</div>
<div class="rounded-lg">大圆角</div>
<div class="rounded-full">全圆角</div>
```

## 深色模式

在深色模式下，所有颜色都会自动调整为适合深色背景的版本：

- 背景色变为深色
- 文字色变为浅色
- 边框色调整为深色
- 阴影效果增强

### 深色模式切换
```html
<!-- 添加 dark 类名启用深色模式 -->
<div class="dark">
  <div class="bg-background text-foreground">
    深色模式内容
  </div>
</div>
```

## 渐变背景

### 渐变类
- **主色渐变**: `gradient-primary` - 从主色到深色主色
- **次要渐变**: `gradient-secondary` - 从次要色到静音色

### 使用示例
```html
<div class="gradient-primary text-white p-4">
  主色渐变背景
</div>
<div class="gradient-secondary p-4">
  次要渐变背景
</div>
```

## 加载动画

### 使用示例
```html
<div class="loading w-6 h-6"></div>
```

## 滚动条样式

系统已自动配置了美观的滚动条样式：
- 宽度: 8px
- 轨道色: 静音色
- 滑块色: 静音前景色 (50% 透明度)
- 悬停色: 静音前景色 (70% 透明度)

## 最佳实践

1. **一致性**: 始终使用预定义的颜色变量，避免硬编码颜色值
2. **可访问性**: 确保文字和背景色的对比度符合 WCAG 标准
3. **语义化**: 根据功能选择适当的颜色（成功用绿色，错误用红色等）
4. **响应式**: 在不同设备上测试颜色效果
5. **深色模式**: 确保所有颜色在深色模式下都有良好的表现

## 自定义颜色

如需添加新的颜色，请在 `assets/css/tailwind.css` 中的 `:root` 和 `.dark` 部分添加相应的 CSS 变量，然后在 `tailwind.config.ts` 中添加对应的配置。 