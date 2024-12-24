import React, { useState } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import { Card, Space } from 'antd';
import './App.css'; // 引入CSS文件

const App = () => {
  const [Slice, setSlice] = useState('Toss');
  const [Constraint, setConstraint] = useState('ae'); // 约束选择
  const [Flipped, setFlipped] = useState(false); // 翻转状态

  const historicalData = {
    labels: ['Shot 1', 'Shot 2', 'Shot 3', 'Shot 4', 'Shot 5'],
    datasets: [
      {
        label: 'Release Time',
        data: [0.68, 0.72, 0.75, 0.70, 0.69],
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  // 二维列表：上方选择栏选项与右侧约束选择栏选项的映射
  const constraintOptions = {
    'Toss': ['aarm', 'ae'],
    'Swing': ['arm', 'aarm', 'ae'],
    'Hit': ['arm', 'ae', 'spine'],
  };

  const dict = {
    'arm': '肘关节',
    'aarm': '主手臂',
    'ae': '副手臂',
    'spine': '躯干',
  };

  // 根据上方选择栏的选项动态生成右侧约束选择栏的选项
  const currentConstraints = constraintOptions[Slice] || [];

  // 切片数据检索
  const userImage = '/assets/user/' + Slice.toLowerCase() + '/' + Constraint + '.png';
  const stdImagex = '/assets/std/' + Slice.toLowerCase() + '/' + Constraint + 'x.png';
  const stdImagey = '/assets/std/' + Slice.toLowerCase() + '/' + Constraint + 'y.png';

  // 切换翻转状态
  const toggleFlip = () => {
    setFlipped(!Flipped);
  };

  return (
    <div className="app">
      {/* 左侧部分 */}
      <div className="left-section">
        {/* 上边栏：动作切片选择（横排图标） */}
        <div className="top-bar">
          <Space>
            <IconButton
              title="抛球"
              imageSrc="/assets/logos/toss.png"
              isActive={Slice === 'Toss'}
              onClick={() => setSlice('Toss')}
            />
            <IconButton
              title="引拍"
              imageSrc="/assets/logos/swing.png"
              isActive={Slice === 'Swing'}
              onClick={() => setSlice('Swing')}
            />
            <IconButton
              title="击球"
              imageSrc="/assets/logos/hit.png"
              isActive={Slice === 'Hit'}
              onClick={() => setSlice('Hit')}
            />
          </Space>
        </div>

        {/* 中间部分：包含图片区域和约束选择栏 */}
        <div className="middle-section">
          {/* 中间区域：两张图片 */}
          <div className="image-section">
            <Card title="用户分析" style={{ width: '45%' }}>
              <img src={userImage} alt="User Analysis" />
            </Card>
            <Card title="标准动作" style={{ width: '45%' }} onClick={toggleFlip}>
              <img src={Flipped ? stdImagey : stdImagex} alt="Standard Action" />
            </Card>
          </div>

          {/* 右侧约束选择栏（竖排贯穿页面） */}
          <div className="constraint-sidebar">
            <Space direction="vertical" size="large">
              {currentConstraints.map((constraint) => (
                <IconButton
                  title={dict[constraint]}
                  imageSrc={`/assets/logos/${constraint}.png`}
                  isActive={Constraint === constraint}
                  onClick={() => setConstraint(constraint)}
                />
              ))}
            </Space>
          </div>
        </div>

        {/* 下方区域：关键信息分析 */}
        <div className="info-section">
          <Card title="关键信息分析">
            <p>Torso Lean: 34° (建议: 45°)</p>
            {/* 其他关键信息 */}
          </Card>
        </div>
      </div>

      {/* 右侧部分：历史信息图表 */}
      <div className="right-section">
        {/* 图表 */}
        <div className="chart-section">
          <Card title="历史信息图表">
            <Chart data={historicalData} type="line" />
          </Card>
        </div>
      </div>
    </div>
  );
};

// 自定义图标按钮组件
const IconButton = ({ title, imageSrc, isActive, onClick }) => (
  <div
    className={`icon-button ${isActive ? 'active' : ''}`}
    onClick={onClick}
    style={{ backgroundImage: `url(${imageSrc})` }}
  >
    {title}
  </div>
);

export default App;