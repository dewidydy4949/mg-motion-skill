import type {TableFocusProps} from './model';

export const referenceProps: TableFocusProps = {
  title:'团队通讯录',viewLabel:'表格',durationSeconds:10,focus:['salary','review'],
  question:'谁能看见\n薪资？',closing:'由你决定，谁能看见。',
  footnote:'参考片数据的中文转写 · 未作事实核验',dimOpacity:.22,
  columns:[
    {id:'name',label:'姓名',width:270,icon:'person'},
    {id:'team',label:'团队',width:245,icon:'team'},
    {id:'role',label:'职位',width:300,icon:'briefcase'},
    {id:'salary',label:'薪资',width:270,icon:'money',align:'right',locked:true},
    {id:'review',label:'评语',width:320,icon:'star',locked:true},
    {id:'start',label:'入职日期',width:275,icon:'calendar'},
  ],
  rows:[
    {id:'maya',cells:{name:'Maya Chen',team:{text:'人事',tag:'rose'},role:'人事伙伴',salary:'$140,000',review:'第一季度晋升',start:'2021-03-04'}},
    {id:'dev',cells:{name:'Dev Okafor',team:{text:'研发',tag:'blue'},role:'资深工程师',salary:'$230,000',review:'年度表现优秀',start:'2019-01-09'}},
    {id:'priya',cells:{name:'Priya Nair',team:{text:'财务',tag:'green'},role:'财务主管',salary:'$190,000',review:'超出预期',start:'2020-08-17'}},
    {id:'sam',cells:{name:'Sam Rivera',team:{text:'设计',tag:'violet'},role:'设计师',salary:'$160,000',review:'进展顺利',start:'2022-06-06'}},
    {id:'ari',cells:{name:'Ari Levin',team:{text:'研发',tag:'blue'},role:'工程师',salary:'$175,000',review:'需要支持',start:'2023-11-13'}},
  ],
};

export const usageProps: TableFocusProps = {
  title:'AI 工作流测试',viewLabel:'结果记录',durationSeconds:10,focus:['pass','verdict'],
  question:'这次测试，\n哪些已达标？',closing:'聚焦结论，也保留上下文。',
  footnote:'演示数据 · 用于验证模板复用，不代表实际评测结果',dimOpacity:.20,
  columns:[
    {id:'task',label:'任务',width:280,icon:'briefcase'},
    {id:'workflow',label:'流程',width:240,icon:'team'},
    {id:'count',label:'样本数',width:190,icon:'table',align:'right'},
    {id:'pass',label:'通过率',width:270,icon:'check',align:'right'},
    {id:'verdict',label:'结论',width:400,icon:'star'},
    {id:'date',label:'更新日期',width:300,icon:'calendar'},
  ],
  rows:[
    {id:'notes',cells:{task:'会议纪要',workflow:{text:'整理',tag:'blue'},count:'20',pass:'95%',verdict:'结构清楚，待复核',date:'2026-10-26'}},
    {id:'summary',cells:{task:'文档摘要',workflow:{text:'提炼',tag:'green'},count:'20',pass:'90%',verdict:'保留关键结论',date:'2026-10-26'}},
    {id:'sheet',cells:{task:'表格整理',workflow:{text:'分类',tag:'violet'},count:'20',pass:'100%',verdict:'字段与分类一致',date:'2026-10-26'}},
    {id:'search',cells:{task:'知识检索',workflow:{text:'检索',tag:'amber'},count:'20',pass:'85%',verdict:'补充来源说明',date:'2026-10-26'}},
    {id:'mail',cells:{task:'邮件草稿',workflow:{text:'写作',tag:'rose'},count:'20',pass:'95%',verdict:'语气符合要求',date:'2026-10-26'}},
    {id:'compare',cells:{task:'版本比较',workflow:{text:'核对',tag:'blue'},count:'20',pass:'90%',verdict:'差异已逐项标注',date:'2026-10-26'}},
  ],
};
