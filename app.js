
//存取localstorage中的数据
var store={
	save(key,value){
		localStorage.setItem(key,JSON.stringify(value));
	},
	fetch(key){
		return JSON.parse(localStorage.getItem(key)) || []
	}
};

//取出所有的值
var list = store.fetch("Peri He");
//过滤的时候有三种情况，all,finished,unfinished
var filter = {
	all:function(list){
		return list;
	},
	unfinished:function(){
		return list.filter(function(item){
			return !item.isChecked;
		})
	},
	finished:function(){
		return list.filter(function(item){
			return item.isChecked;
		})
	}
}

var vm = new Vue({
	el:".main",
	data:{
		list:list,
		todo:'',
		editorTodos:'' ,//记录正在编辑的数据
		beforeTitle:'' ,//记录正在编辑的数据的title
		visibility:"all" //通过这个值的变化对数据进行筛选
	},
	watch:{  //监控list这个属性，当这个属性对应的值发生改变时执行函数
		// list:function(){
		// 	store.save("Peri He",this.list);
		// }

		list:{   //深度监控！
			handle:function(){
				store.save("Peri He",this.list);
				deep:true
			}
		}
	},
	computed:{
		nocheckLength:function(){
			return this.list.filter(function(item){
				return !item.isChecked;
			}).length
		},
		filteredList:function(){
			//找到了过滤函数就返回过滤后的数据，没有就返回所有数据
			return filter[this.visibility]?filter[this.visibility](list):list;
		}
	},
	methods:{
		//添加任务
		addTodo(ev){ //函数简写的方式，es6
			this.list.push({  //事件处理函数中的this指向的是当前这个根实例
				title:this.todo,
				isChecked:false
			});   

			this.todo = ''; //添加成功后清空输入框
		},
		//删除任务
		deleteTodo(todo){
			var index = this.list.indexOf(todo);
			this.list.splice(index,1);
		},
		//编辑任务
		editorTodo(todo){ 
			//编辑任务的时候记录一下这条任务的title,方便在取消编辑的时候重新复制回来
			this.beforeTitle = todo.title;
			this.editorTodos = todo;
		},
		//编辑完成
		editorTodoed(todo){
			this.editorTodos = "";
		},
		//取消编辑
		cancelTodo(todo){
			todo.title = this.beforeTitle;
			this.beforeTitle = '';
			//让div显示，input隐藏
			this.editorTodos = '';
		}
	},
	directives:{
		"focus":{
			update(el,binding){
				if(binding.value){
					el.focus();
				}
			}
		}
	}
});

function watchHashChange(){
	var hash = window.location.hash.slice(1);
	vm.visibility = hash;
}
watchHashChange();
window.addEventListener("hashchange",watchHashChange);