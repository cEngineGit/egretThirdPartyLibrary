/*! Behavior3JS 2014-10-27 */

window.b3=window.b3||{},function(){"use strict";b3.VERSION="0.1.0",b3.SUCCESS=1,b3.FAILURE=2,b3.RUNNING=3,b3.ERROR=4,b3.COMPOSITE="composite",b3.DECORATOR="decorator",b3.ACTION="action",b3.CONDITION="condition",b3.createUUID=function(){for(var a=[],b="0123456789abcdef",c=0;36>c;c++)a[c]=b.substr(Math.floor(16*Math.random()),1);a[14]="4",a[19]=b.substr(3&a[19]|8,1),a[8]=a[13]=a[18]=a[23]="-";var d=a.join("");return d},b3.Class=function(a){var b=function(a){this.initialize(a)};return a&&(b.prototype=new a,b.prototype.constructor=b),b.prototype.initialize=b.prototype.initialize||function(){},b}}(),window.b3=window.b3||{},function(){"use strict";var a=b3.Class(),b=a.prototype;b.initialize=function(){this._baseMemory={},this._treeMemory={}},b._getTreeMemory=function(a){return this._treeMemory[a]||(this._treeMemory[a]={nodeMemory:{},openNodes:[],traversalDepth:0,traversalCycle:0}),this._treeMemory[a]},b._getNodeMemory=function(a,b){var c=a.nodeMemory;return c[b]||(c[b]={}),c[b]},b._getMemory=function(a,b){var c=this._baseMemory;return a&&(c=this._getTreeMemory(a),b&&(c=this._getNodeMemory(c,b))),c},b.set=function(a,b,c,d){var e=this._getMemory(c,d);e[a]=b},b.get=function(a,b,c){var d=this._getMemory(b,c);return d[a]},b3.Blackboard=a}(),window.b3=window.b3||{},function(){"use strict";var a=b3.Class(),b=a.prototype;b.initialize=function(){this.tree=null,this.debug=null,this.target=null,this.blackboard=null,this._openNodes=[],this._nodeCount=0},b._enterNode=function(a){this._nodeCount++,this._openNodes.push(a)},b._openNode=function(){},b._tickNode=function(){},b._closeNode=function(){this._openNodes.pop()},b._exitNode=function(){},b3.Tick=a}(),window.b3=window.b3||{},function(){"use strict";var a=b3.Class(),b=a.prototype;b.initialize=function(){this.id=b3.createUUID(),this.title="The behavior tree",this.description="Default description",this.properties={},this.root=null,this.debug=null},b.load=function(a,b){b=b||{},this.title=a.title||this.title,this.description=a.description||this.description,this.properties=a.properties||this.properties;var c={};for(var d in a.nodes){var e=a.nodes[d];if(e.name in b)var f=b[e.name];else{if(!(e.name in b3))throw EvalError('BehaviorTree.load: Invalid node name + "'+e.name+'".');var f=b3[e.name]}var g=new f(e.parameters);g.id=e.id||g.id,g.title=e.title||g.title,g.description=e.description||g.description,g.properties=e.properties||g.properties,g.parameters=e.parameters||g.parameters,c[d]=g}for(var d in a.nodes){var e=a.nodes[d],g=c[d];if(g.category===b3.COMPOSITE&&e.children)for(var h=0;h<e.children.length;h++){var i=e.children[h];g.children.push(c[i])}else g.category===b3.DECORATOR&&e.child&&(g.child=c[e.child])}this.root=c[a.root]},b.dump=function(){var a={};if(a.title=this.title,a.description=this.description,a.root=this.root?this.root.id:null,a.properties=this.properties,a.nodes={},!this.root)return a;for(var b=[this.root];b.length>0;){var c=b.pop(),d={};if(d.id=c.id,d.name=c.name,d.title=c.title,d.description=c.description,d.properties=c.properties,d.parameters=c.parameters,c.category===b3.COMPOSITE&&c.children){for(var e=[],f=c.children.length-1;f>=0;f--)e.push(c.children[f].id),b.push(c.children[f]);d.children=e}else c.category===b3.DECORATOR&&c.child&&(b.push(c.child),d.child=c.child.id);a.nodes[c.id]=d}return a},b.tick=function(a,b){if(!b)throw"The blackboard parameter is obligatory and must be an instance of b3.Blackboard";var c=new b3.Tick;c.debug=this.debug,c.target=a,c.blackboard=b,c.tree=this;for(var d=this.root._execute(c),e=b.get("openNodes",this.id),f=c._openNodes.slice(0),g=0,h=0;h<Math.min(e.length,f.length)&&(g=h+1,e[h]===f[h]);h++);for(var h=e.length-1;h>=g;h--)e[h]._close(c);return b.set("openNodes",f,this.id),b.set("nodeCount",c._nodeCount,this.id),d},b3.BehaviorTree=a}(),window.b3=window.b3||{},function(){"use strict";var a=b3.Class(),b=a.prototype;b.name=null,b.category=null,b.title=null,b.description=null,b.parameters=null,b.properties=null,b.initialize=function(){this.id=b3.createUUID(),this.title=this.title||this.name,this.description="",this.parameters={},this.properties={}},b._execute=function(a){this._enter(a),a.blackboard.get("isOpen",a.tree.id,this.id)||this._open(a);var b=this._tick(a);return b!==b3.RUNNING&&this._close(a),this._exit(a),b},b._enter=function(a){a._enterNode(this),this.enter(a)},b._open=function(a){a._openNode(this),a.blackboard.set("isOpen",!0,a.tree.id,this.id),this.open(a)},b._tick=function(a){return a._tickNode(this),this.tick(a)},b._close=function(a){a._closeNode(this),a.blackboard.set("isOpen",!1,a.tree.id,this.id),this.close(a)},b._exit=function(a){a._exitNode(this),this.exit(a)},b.enter=function(){},b.open=function(){},b.tick=function(){},b.close=function(){},b.exit=function(){},b3.BaseNode=a}(),window.b3=window.b3||{},function(){"use strict";var a=b3.Class(b3.BaseNode),b=a.prototype;b.category=b3.ACTION,b.__BaseNode_initialize=b.initialize,b.initialize=function(){this.__BaseNode_initialize()},b3.Action=a}(),window.b3=window.b3||{},function(){"use strict";var a=b3.Class(b3.BaseNode),b=a.prototype;b.category=b3.COMPOSITE,b.__BaseNode_initialize=b.initialize,b.initialize=function(a){a=a||{},this.__BaseNode_initialize(),this.children=(a.children||[]).slice(0)},b3.Composite=a}(),window.b3=window.b3||{},function(){"use strict";var a=b3.Class(b3.BaseNode),b=a.prototype;b.category=b3.DECORATOR,b.__BaseNode_initialize=b.initialize,b.initialize=function(a){a=a||{},this.__BaseNode_initialize(),this.child=a.child||null},b3.Decorator=a}(),window.b3=window.b3||{},function(){"use strict";var a=b3.Class(b3.BaseNode),b=a.prototype;b.category=b3.CONDITION,b.__BaseNode_initialize=b.initialize,b.initialize=function(){this.__BaseNode_initialize()},b3.Condition=a}(),window.b3=window.b3||{},function(){"use strict";var a=b3.Class(b3.Composite),b=a.prototype;b.name="Sequence",b.tick=function(a){for(var b=0;b<this.children.length;b++){var c=this.children[b]._execute(a);if(c!==b3.SUCCESS)return c}return b3.SUCCESS},b3.Sequence=a}(),window.b3=window.b3||{},function(){"use strict";var a=b3.Class(b3.Composite),b=a.prototype;b.name="Priority",b.tick=function(a){for(var b=0;b<this.children.length;b++){var c=this.children[b]._execute(a);if(c!==b3.FAILURE)return c}return b3.FAILURE},b3.Priority=a}(),window.b3=window.b3||{},function(){"use strict";var a=b3.Class(b3.Composite),b=a.prototype;b.name="MemSequence",b.open=function(a){a.blackboard.set("runningChild",0,a.tree.id,this.id)},b.tick=function(a){for(var b=a.blackboard.get("runningChild",a.tree.id,this.id),c=b;c<this.children.length;c++){var d=this.children[c]._execute(a);if(d!==b3.SUCCESS)return d===b3.RUNNING&&a.blackboard.set("runningChild",c,a.tree.id,this.id),d}return b3.SUCCESS},b3.MemSequence=a}(),window.b3=window.b3||{},function(){"use strict";var a=b3.Class(b3.Composite),b=a.prototype;b.name="MemPriority",b.open=function(a){a.blackboard.set("runningChild",0,a.tree.id,this.id)},b.tick=function(a){for(var b=a.blackboard.get("runningChild",a.tree.id,this.id),c=b;c<this.children.length;c++){var d=this.children[c]._execute(a);if(d!==b3.FAILURE)return d===b3.RUNNING&&a.blackboard.set("runningChild",c,a.tree.id,this.id),d}return b3.FAILURE},b3.MemPriority=a}(),window.b3=window.b3||{},function(){"use strict";var a=b3.Class(b3.Decorator),b=a.prototype;b.name="Inverter",b.tick=function(a){if(!this.child)return b3.ERROR;var b=this.child._execute(a);return b==b3.SUCCESS?b=b3.FAILURE:b==b3.FAILURE&&(b=b3.SUCCESS),b},b3.Inverter=a}(),window.b3=window.b3||{},function(){"use strict";var a=b3.Class(b3.Decorator),b=a.prototype;b.name="Limiter",b.parameters={maxLoop:null},b.__Decorator_initialize=b.initialize,b.initialize=function(a){if(a=a||{},this.__Decorator_initialize(a),!a.maxLoop)throw"maxLoop parameter in Limiter decorator is an obligatory parameter";this.maxLoop=a.maxLoop},b.open=function(a){a.blackboard.set("i",0,a.tree.id,this.id)},b.tick=function(a){if(!this.child)return b3.ERROR;var b=a.blackboard.get("i",a.tree.id,this.id);if(b<this.maxLoop){var c=this.child._execute(a);return(c==b3.SUCCESS||c==b3.FAILURE)&&a.blackboard.set("i",b+1,a.tree.id,this.id),c}return b3.FAILURE},b3.Limiter=a}(),window.b3=window.b3||{},function(){"use strict";var a=b3.Class(b3.Decorator),b=a.prototype;b.name="MaxTime",b.title="Max Time",b.parameters={maxTime:null},b.__Decorator_initialize=b.initialize,b.initialize=function(a){if(a=a||{},this.__Decorator_initialize(a),!a.maxTime)throw"maxTime parameter in MaxTime decorator is an obligatory parameter";this.maxTime=a.maxTime},b.open=function(a){var b=(new Date).getTime();a.blackboard.set("startTime",b,a.tree.id,this.id)},b.tick=function(a){if(!this.child)return b3.ERROR;var b=(new Date).getTime(),c=a.blackboard.get("startTime",a.tree.id,this.id),d=this.child._execute(a);return b-c>this.maxTime?b3.FAILURE:d},b3.MaxTime=a}(),window.b3=window.b3||{},function(){"use strict";var a=b3.Class(b3.Decorator),b=a.prototype;b.name="Repeater",b.parameters={maxLoop:-1},b.__Decorator_initialize=b.initialize,b.initialize=function(a){a=a||{},this.__Decorator_initialize(a),this.maxLoop=a.maxLoop||-1},b.open=function(a){a.blackboard.set("i",0,a.tree.id,this.id)},b.tick=function(a){if(!this.child)return b3.ERROR;for(var b=a.blackboard.get("i",a.tree.id,this.id),c=b3.SUCCESS;(this.maxLoop<0||b<this.maxLoop)&&(c=this.child._execute(a),c==b3.SUCCESS||c==b3.FAILURE);)b++;return b=a.blackboard.set("i",b,a.tree.id,this.id),c},b3.Repeater=a}(),window.b3=window.b3||{},function(){"use strict";var a=b3.Class(b3.Decorator),b=a.prototype;b.name="RepeatUntilFailure",b.title="Repeat Until Failure",b.parameters={maxLoop:-1},b.__Decorator_initialize=b.initialize,b.initialize=function(a){a=a||{},this.__Decorator_initialize(a),this.maxLoop=a.maxLoop||-1},b.open=function(a){a.blackboard.set("i",0,a.tree.id,this.id)},b.tick=function(a){if(!this.child)return b3.ERROR;for(var b=a.blackboard.get("i",a.tree.id,this.id);this.maxLoop<0||b<this.maxLoop;){var c=this.child._execute(a);if(c!=b3.SUCCESS)break;b++}var b=a.blackboard.set("i",b,a.tree.id,this.id);return c},b3.RepeatUntilFailure=a}(),window.b3=window.b3||{},function(){"use strict";var a=b3.Class(b3.Decorator),b=a.prototype;b.name="RepeatUntilSuccess",b.title="Repeat Until Success",b.parameters={maxLoop:-1},b.__Decorator_initialize=b.initialize,b.initialize=function(a){a=a||{},this.__Decorator_initialize(a),this.maxLoop=a.maxLoop||-1},b.open=function(a){a.blackboard.set("i",0,a.tree.id,this.id)},b.tick=function(a){if(!this.child)return b3.ERROR;for(var b=a.blackboard.get("i",a.tree.id,this.id);this.maxLoop<0||b<this.maxLoop;){var c=this.child._execute(a);if(c!=b3.FAILURE)break;b++}var b=a.blackboard.set("i",b,a.tree.id,this.id);return c},b3.RepeatUntilSuccess=a}(),window.b3=window.b3||{},function(){"use strict";var a=b3.Class(b3.Action),b=a.prototype;b.name="Error",b.tick=function(){return b3.ERROR},b3.Error=a}(),window.b3=window.b3||{},function(){"use strict";var a=b3.Class(b3.Action),b=a.prototype;b.name="Failer",b.tick=function(){return b3.FAILURE},b3.Failer=a}(),window.b3=window.b3||{},function(){"use strict";var a=b3.Class(b3.Action),b=a.prototype;b.name="Runner",b.tick=function(){return b3.RUNNING},b3.Runner=a}(),window.b3=window.b3||{},function(){"use strict";var a=b3.Class(b3.Action),b=a.prototype;b.name="Succeeder",b.tick=function(){return b3.SUCCESS},b3.Succeeder=a}(),window.b3=window.b3||{},function(){"use strict";var a=b3.Class(b3.Action),b=a.prototype;b.name="Wait",b.parameters={milliseconds:0},b.__Action_initialize=b.initialize,b.initialize=function(a){a=a||{},this.__Action_initialize(),this.endTime=a.milliseconds||0},b.open=function(a){var b=(new Date).getTime();a.blackboard.set("startTime",b,a.tree.id,this.id)},b.tick=function(a){var b=(new Date).getTime(),c=a.blackboard.get("startTime",a.tree.id,this.id);return b-c>this.endTime?b3.SUCCESS:b3.RUNNING},b3.Wait=a}();