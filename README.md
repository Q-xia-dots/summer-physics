# summer物理

一个静态的交互物理模型网站，视觉与交互遵循 `../物理模型风格规范.md`。

## 打开

直接双击 `index.html`，或把它拖进浏览器。

## 页面

- `index.html`：首页，包含实时单摆预览与模型库。
- `models/pendulum.html`：站内单摆模型，来自单文件交互模型，保留了完整物理与控件。
- `models/spring.html`：站内弹簧振子模型，包含振动图像/方程与波动图像/方程。
- `models/orbit.html`：站内天体轨道模型，包含可拖动小球、圆轨道、转移椭圆、A、B 切点与 a、v、ω 推导。
- `models/electrostatics.html`：站内静电场模型，包含点电荷、等量异种、等量同种、电极板、场强探针与可拖动试探电荷。
- `models/collision.html`：站内动量守恒模型，包含弹性、非弹性、完全非弹性碰撞与动量/动能对比。
- `assets/`：共享样式、首页实时预览脚本、图标与模型预览图。

## 目录

```text
summer-physics/
├── index.html
├── models/
│   ├── pendulum.html
│   ├── spring.html
│   ├── orbit.html
│   ├── electrostatics.html
│   └── collision.html
├── assets/
│   ├── site.css
│   ├── site.js
│   ├── favicon.svg
│   ├── pendulum-preview.png
│   ├── spring-preview.png
│   ├── orbit-preview.png
│   ├── electrostatics-preview.png
│   └── collision-preview.png
└── README.md
```

## 部署

这是一个纯静态站点，没有构建步骤。把 `summer-physics` 整个目录放到任意静态服务器根目录即可；保持目录内相对路径不变。

## 说明

首页的摆球是实时 Canvas 预览；点击预览卡或模型库中的卡片进入完整的可交互模型页。模型页左上角的 `← summer物理` 返回首页。

## 新模型验收流程

新模型先作为独立文件验收，**通过后才加入网站**：

1. 先在 `physics-anim/` 生成独立模型并测试。
2. 用户验收通过前，不加入首页模型库、导航、页脚或 `models/`。
3. 通过后复制到 `models/`，补 `← summer物理` 返回入口，生成预览图并更新首页卡片。
4. 同步更新独立模型、站内模型页和预览图，避免版本分叉。

## 修改模型时

每个模型都有独立版本与站内版本，修改时必须同步，不能只改其中一个。

### 单摆

1. 独立模型：`../physics-anim/单摆-可操控模型.html`
2. 站内模型页：`models/pendulum.html`（保留顶部的 `← summer物理` 返回链接）
3. 首页预览图：`assets/pendulum-preview.png`（重新截取最新界面）
4. 如果功能或文案变化，同步更新 `index.html` 中的模型卡片说明

### 弹簧振子

1. 独立模型：`../physics-anim/弹簧振子-可操控模型.html`
2. 站内模型页：`models/spring.html`（保留顶部的 `← summer物理` 返回链接）
3. 首页预览图：`assets/spring-preview.png`（重新截取最新界面）
4. 如果功能或文案变化，同步更新 `index.html` 中的弹簧振子卡片

### 天体轨道

1. 独立模型：`../physics-anim/天体轨道-开普勒模型.html`
2. 站内模型页：`models/orbit.html`（保留顶部的 `← summer物理` 返回链接）
3. 首页预览图：`assets/orbit-preview.png`（重新截取最新界面）
4. 如果功能或文案变化，同步更新 `index.html` 中的天体轨道卡片

### 静电场

1. 独立模型：`../physics-anim/静电场-可操控模型.html`
2. 站内模型页：`models/electrostatics.html`（保留顶部的 `← summer物理` 返回链接）
3. 首页预览图：`assets/electrostatics-preview.png`（重新截取最新界面）
4. 如果功能或文案变化，同步更新 `index.html` 中的静电场卡片

### 动量守恒

1. 独立模型：`../physics-anim/动量守恒-两球碰撞.html`
2. 站内模型页：`models/collision.html`（保留顶部的 `← summer物理` 返回链接）
3. 首页预览图：`assets/collision-preview.png`（重新截取最新界面）
4. 如果功能或文案变化，同步更新 `index.html` 中的动量守恒卡片

修改后检查：独立模型可操作、站内模型可操作、首页链接可达、Console 无错误。
