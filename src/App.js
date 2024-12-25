import React, { useState, useEffect } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import { Card, Space } from 'antd';
import './App.css'; // 引入CSS文件

const App = () => {
  const [Slice, setSlice] = useState('Toss');
  const [Constraint, setConstraint] = useState('aarm'); // 约束选择
  const [Flipped, setFlipped] = useState(false); // 翻转状态
  const [TrainingTips, setTrainingTips] = useState({}); // 训练助手
  const [Score, setScore] = useState(90); // 得分
  const [UserAngle, setUserAngle] = useState(0); // 你的动作角度
  const [StdAngle, setStdAngle] = useState(0); // 标准动作角度
  const [HistoricalData, setHistoricalData] = useState({
    "labels": [],
    "datasets": []
  }); // 历史数据
  const [GradeData, setGradeData] = useState({
    "labels": [],
    "datasets": []
  });

  useEffect(() => {
    const GradeData_Path = '/assets/history/grade.json';
    fetch(GradeData_Path)
      .then((response) => response.json())
      .then((data) => setGradeData(data));
  }, []);

  // 二维列表：上方选择栏选项与右侧约束选择栏选项的映射
  const constraintOptions = {
    'Toss': ['aarm', 'ae'],
    'Swing': ['arm', 'aarm', 'ae'],
    'Hit': ['arm', 'ae', 'spine'],
  };

  const dict = {
    'arm': '肘关节',
    'aarm': '发力手',
    'ae': '副手臂',
    'spine': '躯干',
  };

  // 根据上方选择栏的选项动态生成右侧约束选择栏的选项
  const currentConstraints = constraintOptions[Slice] || [];

  // 切片数据检索
  const userImage = '/assets/user/' + Slice.toLowerCase() + '/' + Constraint + '.png';
  const stdImagex = '/assets/std/' + Slice.toLowerCase() + '/' + Constraint + 'x.png';
  const stdImagey = '/assets/std/' + Slice.toLowerCase() + '/' + Constraint + 'y.png';

    useEffect(() => {
      // 从本地读取训练助手的数据
      const trainingTips_Path = '/assets/tips/' + Slice.toLowerCase() + '.json';
      fetch(trainingTips_Path)
        .then((response) => response.json())
        .then((data) => setTrainingTips(data));
    
      // 从本地读取角度数据
      const angleData_Path = '/assets/angles/' + Slice.toLowerCase() + '.json';
      fetch(angleData_Path)
        .then((response) => response.json())
        .then((data) => {
          setUserAngle(data["user"]);
          setStdAngle(data["std"]);
          const x = data["user"][Constraint];
          const y = data["std"][Constraint];
          setScore(Math.round(100 - Math.abs(x - y) * 100 / y));
        });
    
      // 从本地读取历史数据
      const historyData_Path = '/assets/history/' + Slice.toLowerCase() + '.json';
      fetch(historyData_Path)
        .then((response) => response.json())
        .then((data) => setHistoricalData(data));
    }, [Slice, Constraint]);
  
  return (
    <div className="app">
      {/* 页面标题 */}
      <div className="title">人体动作引导可视化</div>
      {/* 左侧部分 */}
      <div className="left-section">
        {/* 上边栏：动作切片选择（横排图标） */}
        <div className="top-bar">
          <Space>
            <IconButton
              title="抛球"
              imageSrc="/assets/logos/toss.png"
              isActive={Slice === 'Toss'}
              onClick={() => { setSlice('Toss'); setConstraint('aarm') }}
            />
            <IconButton
              title="引拍"
              imageSrc="/assets/logos/swing.png"
              isActive={Slice === 'Swing'}
              onClick={() => { setSlice('Swing'); setConstraint('arm') }}
            />
            <IconButton
              title="击球"
              imageSrc="/assets/logos/hit.png"
              isActive={Slice === 'Hit'}
              onClick={() => { setSlice('Hit'); setConstraint('arm') }}
            />
          </Space>
        </div>

        {/* 中间部分：包含图片区域和约束选择栏 */}
        <div className="middle-section">
          {/* 中间区域：两张图片 */}
          <div className="image-section">
            <Card title="用户" style={{ width: '45%', textAlign: 'center' }}>
              <img src={userImage} alt="User Analysis" />
            </Card>
            <Card title="标准（费德勒）" style={{ width: '45%', textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img src={Flipped ? stdImagey : stdImagex} alt="Standard Action" />
                <IconButton
                  className="flip-button"
                  imageSrc="/assets/logos/flip.png"
                  onClick={() => setFlipped(!Flipped)}
                />
              </div>
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

        {/* 下方区域：训练助手 */}
        <div className="info-section">
          <p>
            <IconButton
              className="help-icon"
              imageSrc="/assets/logos/help.png"
              onClick={() => console.log('Help clicked')}
            />
            {TrainingTips[Constraint]}
          </p>
        </div>
      </div>

      {/* 右侧部分：历史信息图表 */}
      <div className="right-section">
        <div className="score-section">
          <IconButton
            title={Score}
            className="score-icon"
            imageSrc="/assets/logos/score.png"
            isActive={false}
          />
            <div className="angle-info">
              <p>你的动作：<span className="angle-value-user">{UserAngle[Constraint]}°</span></p>
              <p>标准动作：<span className="angle-value-std">{StdAngle[Constraint]}°</span></p>
            </div>
        </div>
        {/* 图表 */}
        <div className="chart-section">
          <Card title="历史评分" style={{ margin: '20px' }}>
            <Chart data={HistoricalData} type="line" style={{ margin: '20px' }} 
              options={{
                plugins: {
                  title: { display: true, text: '动作评分', font: { size: 16 } },
                },
              }}
            />
            <Chart data={GradeData} type="bar" style= {{ margin: '20px' }} 
              options={{
                plugins: {
                  title: { display: true, text: '总评分', font: { size: 16 } },
                  legend: { display: false}
                },
              }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

// 自定义图标按钮组件
const IconButton = ({ title, imageSrc, isActive, onClick, className }) => (
  <div
    className={`icon-button ${isActive ? 'active' : ''} ${className}`}
    onClick={onClick}
    style={{ backgroundImage: `url(${imageSrc})` }}
  >
    {title}
  </div>
);

export default App;