// 解构React 
// let { Component, PropTypes } = React;
let { Component } = React;
let { render } = ReactDOM;
// 解构路由
let { Router, Route, IndexRoute } = ReactRouter;

// 第一步 定义混合类
class Util extends Component {
	/**
	 * 异步请求方法
	 * @url 	请求地址
	 * @fn 		回调函数
	 **/
	ajax(url, fn) {
		// 创建xhr
		let xhr = new XMLHttpRequest();
		// 注册事件
		xhr.onreadystatechange = () => {
			// 判断状态
			if (xhr.readyState === 4) {
				// 判断状态码
				if (xhr.status === 200) {
					// 执行fn
					fn(JSON.parse(xhr.responseText))
				}
			}
		}
		// 打开请求
		xhr.open('GET', url, true);
		// 发送数据
		xhr.send(null)
	}
	/** 
	 * 将对象转换成query字符串
	 * @obj 	表示对象
	 * return 	query
	 * eg 
	 * 		{a: 1, b: 2, c: 3}
	 * 		?a=1&b=2&c=3
	 ***/
	objToQuery(obj) {
		// 定义结果
		let query = '';
		// 解析obj
		for (let i in obj) {
			// i是属性名称， obj[i]是属性值
			query += '&' + i + '=' + obj[i]
		}
		// query多了一个&, 但是第一个应该是？
		return query.replace('&', '?')
	}
}

// // 定义混合对象
// let Util = {
// 	/**
// 	 * 异步请求方法
// 	 * @url 	请求地址
// 	 * @fn 		回调函数
// 	 **/
// 	ajax(url, fn) {
// 		// 创建xhr
// 		let xhr = new XMLHttpRequest();
// 		// 注册事件
// 		xhr.onreadystatechange = () => {
// 			// 判断状态
// 			if (xhr.readyState === 4) {
// 				// 判断状态码
// 				if (xhr.status === 200) {
// 					// 执行fn
// 					fn(JSON.parse(xhr.responseText))
// 				}
// 			}
// 		}
// 		// 打开请求
// 		xhr.open('GET', url, true);
// 		// 发送数据
// 		xhr.send(null)
// 	}
// }

// 定义组件
class Header extends Component {
	// 点击返回按钮，返回上一个页面
	goBack() {
		// 返回路由上一个状态
		// history.go(-1)	// 被react路由处理了
		history.back();
		// console.log(this)
		// this.props.history.go(-1)
	}
	render() {
		// <div className="go-back">&lt;</div>
		return (
			<div className="header">
				<div className="go-back arrow" onClick={this.goBack.bind(this)}>
					<div className="arrow blue"></div>
				</div>
				<div className="login">登录</div>
				<h1>爱创课堂新闻平台</h1>
			</div>
		)
	}
}
// let demo = {
// 	color: 'red'
// }
// 首页
// 第二步 继承混合类
class Home extends Util {
	constructor(props) {
		// 构造函数继承
		super(props);
		// 定义状态
		this.state = {
			data: []
		}
	}
	// 定义点击事件
	clickItem(id) {
		// console.log(this, arguments)
		// 根据js方式改变路由
		location.hash = '#/detail/' + id
		// 通过路由的history对象改变
		// this.props.history.replace('/detail/' + id)
	}
	// 渲染列表
	createList() {
		return this.state.data.map((obj, index) => (
			<li key={index} onClick={this.clickItem.bind(this, obj.id)}>
				{/*<a href={'#/detail/' + obj.id}>*/}
					<img src={obj.img} alt="" />
					<div className="content">
						<h3>{obj.title}</h3>
						<p><span>{obj.content}</span><span className="home-comment">{'评论：' + obj.comment}</span></p>
					</div>
				{/*</a>*/}
			</li>
		))
	}
	render() {
		return (
			<div className="home">
				<ul>{this.createList()}</ul>
			</div>
		)
	}
	// 组件创建完成，请求数据
	componentDidMount() {
		// console.log(this)
		// 发送请求
		this.ajax('data/list.json', res => {
			if (res && res.errno === 0) {
				this.setState({
					data: res.data
				})
			}
		})
		// 发送请求
		// Util.ajax('data/list.json', res => {
		// 	// 请求成功 ，存储数据
		// 	if (res && res.errno === 0) {
		// 		this.setState({
		// 			data: res.data
		// 		})
		// 	}
		// })
	}
}
// 详情页
class Detail extends Util {
	// 定义构造函数，初始化状态
	constructor(props) {
		// 构造函数继承
		super(props)
		// 初始化状态数据
		this.state = {
			data: {}
		}
	}
	// 进入评论页
	showComments(id) {
		// 第一种，通过状态获取
		// console.log(this.state.data.id)
		// 第二种，传递id
		// console.log(111, id)
		// 第三种 通过路由
		// console.log(222, this.props.params.id)
		// 进入详情页
		// this.props.history.replace('comments/' + this.props.params.id)
		location.hash = '#/comments/' + this.props.params.id
	}
	render() {
		// 缓存data数据
		let data = this.state.data;
		// 设置内容
		let content = {
			__html: data.content
		}
		return (
			<div className="detail">
				<h1>{data.title}</h1>
				<p><span className="time">{data.time}</span><span className="state">{'评论:' + data.comment}</span></p>
				<img src={data.img} alt="" />
				<p className="content" dangerouslySetInnerHTML={content}></p>
				<div className="btn" onClick={this.showComments.bind(this, data.id)}>查看更多评论</div>
			</div>
		)
	}
	// 组件创建完成，更新数据
	componentDidMount() {
		// 请求数据
		this.ajax('data/detail.json?id=' + this.props.params.id, res => {
			// 请求成功，存储数据
			if (res && res.errno === 0) {
				this.setState({
					data: res.data
				})
			}
		})
	}
}
// 评论页
class Comments extends Util {
	// 初始化状态
	constructor(props) {
		// 构造函数继承
		super(props);
		// 初始化data数据
		this.state = {
			id: '', // 新闻id
			list: [] // 评论数据
		}
	}
	submitComment() {
		// 2 获取内容
		let val = this.refs.commentValue.value;
		// 3 脏值检测
		if (/^\s*$/.test(val)) {
			// 失败给出提示
			alert('请输入内容')
			return ;
		}
		// 拼凑一份数据
		let date = new Date();
		let data = {
			// 内容
			content: val,
			// 用户名
			user: '雨夜清荷',
			// 日期
			time: '刚刚: ' + date.getHours() + ':'+ date.getMinutes() + ':' + date.getSeconds()
		}
		// 4 向服务器发送提交的请求
		this.ajax('data/addComment.json' + this.objToQuery(data), res => {
			// 5 请求成功，渲染该条评论
			// 就是更新状态，在前面插入该条数据
			let list = this.state.list;
			// 在前面插入该条数据
			list.unshift(data)
			// 更新状态
			this.setState({
				list: list
			})
			// 6 清空输入框
			this.refs.commentValue.value = '';
		})
		
	}
	// 渲染列表
	createList() {
		return this.state.list.map((obj, index) => (
			<li key={index}>
				<h3>{obj.user}</h3>
				<p>{obj.content}</p>
				<span>{obj.time}</span>
			</li>
		))
	}
	render() {
		return (
			<div className="commnets">
				<div className="box">
					<textarea ref="commentValue" placeholder="文明上网，理性发言"></textarea>
				</div>
				{/*1 点击提交按钮*/}
				<div className="submit-btn">
					<span onClick={this.submitComment.bind(this)}>提交</span>
				</div>
				<ul>{this.createList()}</ul>
			</div>
		)
	}
	// 加载完成，拉去数据
	componentDidMount() {
		// 请求数据
		this.ajax('data/comment.json?id=' + this.props.params.id, res => {
			// 返回成功，存储数据
			// console.log(res)
			if (res && res.errno === 0) {
				// 存储数据
				this.setState({
					id: res.data.id,
					list: res.data.list
				})
			}
		})
	}
}


// 定义组件
class App extends Component {
	// 构造函数
	constructor(props) {
		// 继承属性
		super(props);
		// 初始化属性
		// this.state = {
		// 	appColor: props.color
		// }
	}
	// parentMethod() {
	// 	console.log('parent', this, arguments)
	// }
	// 渲染组件
	render() {
		return (
			<div>
				<Header history={this.props.history}></Header>
				{/* 第一步 定义容器元素 */}
				{this.props.children}
			</div>
		)
	}
}
// 定义默认属性
// App.defaultProps = {
// 	color: 'red'
// }
// // 定义属性约束
// App.propTypes = {
// 	color: PropTypes.string
// }

// 第二步 定义路由规则
let routes = (
	<Router>
		<Route path="/" component={App}>
			<IndexRoute component={Home}></IndexRoute>
			<Route path="detail/:id" component={Detail}></Route>
			<Route path="comments/:id" component={Comments}></Route>
		</Route>
	</Router>
)

// 渲染路由规则
render(routes, document.getElementById('app'))