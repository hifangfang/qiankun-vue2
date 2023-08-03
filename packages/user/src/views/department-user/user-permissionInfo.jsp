<%@ taglib prefix="s" uri="http://www.springframework.org/tags/form"%>
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ include file="/WEB-INF/views/include/taglib.jsp"%>
<html>
<head>
<title>权限计算</title>
<%@include file="/WEB-INF/views/include/metronic_head.jsp"%>
<%@include file="/WEB-INF/views/include/treeview.jsp"%>
<%@include file="/WEB-INF/views/include/jqwidgets.jsp"%>
<script type="text/javascript" src="${ctxStatic}/assets/global/plugins/raphael/raphael-min.js"></script>
<script src="${ctxStatic}/assets/global/plugins/json/json2.js" type="text/javascript"></script>
<style type="text/css">
#holder {
	top: 0px;
	left: 0px;
	right: 0px;
	bottom: 0px;
	position: absolute;
	z-index: 999;
}

.test {
	position: absolute;
	width: 80px;
	height: 30px;
	top: 0px;
	z-index: 1000;
}
</style>
<script type="text/javascript">
	 $(function(){
		    // 用来存储节点的顺序
		    var connections = [];
		    // 拖动节点开始时的事件
		    var dragger = function() {
		        this.ox = this.attr("x");
		        this.oy = this.attr("y");
		        this.animate({
		            "fill-opacity": 0.5
		        },
		        500);
		    };
		    // 拖动事件
		    var move = function(dx, dy) {
		        var att = {
		            x: this.ox + dx,
		            y: this.oy + dy
		        };
		        this.attr(att);
		        $("#test" + this.id).offset({
		            top: this.oy + dy + 3,
		            left: this.ox + dx + 16
		        });
		        for (var i = connections.length; i--;) {
		            r.drawArr(connections[i]);
		        }
		    };
		    // 拖动结束后的事件
		    var up = function() {
		        this.animate({
		            "fill-opacity": 0.1
		        },
		        500);
		    };
		    
		    var roleData = '${roleData}'   //'${fns:clearSpecialChars(roleData)}';使用clearSpecialChars后就不是json格式的数据
		    var roleDataJson = JSON.parse(roleData);
		    var canvasWidth = 1300;
		    var canvasHeight = 560;
		    var roleDataJsonLength = roleDataJson.length;
		    var roleIdArray = new Array();// 存储角色id
		    for(var k = 0 ; k < roleDataJsonLength; k++) {
		    	var roleId = roleDataJson[k].id;
		    	roleIdArray.push(roleId);
		    }
		    var funcAndCustomPrivilegeData;// 存储菜单权限以及自定义权限
			if(roleIdArray.length != 0){
				 $.ajax({
					url:ctx_js+"/identity/department-user/calculatePermissionResult",
					type:"post",
					async:false,
					data:{"roleIds":roleIdArray},
					dataType:"text",
					success:function(data){
						funcAndCustomPrivilegeData = data;
					},
					error:function(err){
						console.log(err);
					}
		    	});
		    	var dataJson = JSON.parse(funcAndCustomPrivilegeData);// 所有权限json对象
		    	var funcPrivilegeData = dataJson.funcPrivilege;
				var customPrivilegeData = dataJson.customPrivilege;
				var funcPrivilegeDataLength = funcPrivilegeData.length;
				var customPrivilegeDataLength =  customPrivilegeData.length;
		    	var allPrivilegeLength = funcPrivilegeDataLength + customPrivilegeDataLength;
		   		if(roleDataJsonLength >= allPrivilegeLength && (roleDataJsonLength > 15 || allPrivilegeLength > 15)){
		    		canvasHeight += (roleDataJsonLength - 15)*35;
		    	}else if(allPrivilegeLength >= roleDataJsonLength && (roleDataJsonLength > 15 || allPrivilegeLength > 15)){
		    		canvasHeight += (allPrivilegeLength - 15)*35;
		    	}
			}
		   
		    // 获得当前用户
		    var currentUser = '${userName}';
		    var extraLength = 0;
		    if(currentUser.length > 3){
		    	extraLength = (currentUser.substring(3).length)*15;
		    }
		    $("#holder").css({"width":canvasWidth,"height":canvasHeight});
		    // 创建绘图对象
		    var r = Raphael("holder", canvasWidth, canvasHeight);
		    // 创建用户图标对象
		    var divUser = $('<div id="test1" class="test"><img style="margin-top:-4px" src="${ctxStatic}/image/user.png"/>'+currentUser+'</div>');
		    $("#holder").after(divUser);
		    var tempWidth = 80 + extraLength;
		    $("#test1").css("width",tempWidth + "px");
		    // 绘制节点
			var user = r.rect(50, 245, tempWidth, 20, 4);
			$("#test1").offset({
				top:245+3,
				left:50+16
			});
			user.attr({
				fill: "rgb(191, 0, 0)",
		        stroke: "rgb(191, 0, 0)",
		        "fill-opacity": 0.1,
		        "stroke-width": 2,
		        //cursor:"move"
			});
			// 用于move方法中判断位置
			user.id = 1;
			//user.drag(move, dragger, up);
			
		    // 创建所有角色对象
		    var roleObject = new Array();// 存储角色矩形对象
	 	    var startX = 290;
	 	    var startY = 30;
	 	    var maxLength = 0;
	 	    // 减去70在开始算,防止最后一个图标被隐藏
	 	    var interval = 0;
	 	    if(roleDataJsonLength > 15){
	 	    	interval = (590 + (roleDataJsonLength - 15)*35-70)/roleDataJsonLength;
	 	    }else{
	 	    	interval = (590 - 70)/roleDataJsonLength;
	 	    }
	 	    for(var i = 0; i < roleDataJsonLength;i++) {
	 	       var roleName = roleDataJson[i].name;
	 	       var rolePname = roleDataJson[i].pname;
	 	       var extraLength = 0;
		       if(roleName.length > 3){
		    	  extraLength = (roleName.substring(3).length)*13;
		       }
		       if(extraLength > maxLength){
		       		maxLength = extraLength;
		       }
	 	   	   var divRole = $('<div id="test'+(i+2)+'" class="test" title="所属角色组:'+rolePname+'"><img style="margin-top:-4px" src="${ctxStatic}/image/role.png"/>'+roleName+'</div>');
		   	   $("#holder").after(divRole);
		   	   var index = i + 2;
		   	   var divObj = "#test" + index;
		   	   var tempWidth = 80 + extraLength;
		       $(divObj).css("width",tempWidth + "px");
		   	   var rectObj = r.rect(startX, startY + i*interval, tempWidth, 20, 4);
		   	   
		   	   $(divObj).offset({
				   top:startY + i*interval +3,
				   left:startX+16
			   });
			   rectObj.attr({
				  fill: "rgb(0, 125, 212)",
		          stroke: "rgb(0, 125, 212)",
		         "fill-opacity": 0.1,
		         "stroke-width": 2,
		          "title":"所属角色组:" + rolePname,
		          //cursor:"move"
			   });
			   rectObj.id = i + 2;
			   //rectObj.drag(move, dragger, up);
			   rectObj.mousemove(function(){
			   	  this.animate({
			   	  	 "fill-opacity":0.5
			   	  },1,function(){
			   	     for(var i = 0;i < connections.length;i++){
			   	     	if(connections[i].obj1.id == this.id){
			   	     		var ele = connections[i].arrPath;
	 	     				ele.attr({stroke:"green","stroke-width":3});
	 	     				break;
			   	     	}
			   	     }
			   	  });
			   });
			   rectObj.mouseout(function(){
			   	  this.animate({
			   	  	 "fill-opacity":0.1
			   	  },1,function(){
			   	     for(var i = 0;i < connections.length;i++){
			   	     	if(connections[i].obj1.id == this.id){
			   	     		var ele = connections[i].arrPath;
	 	     				ele.attr({stroke:"green","stroke-width":1});
	 	     				break;
			   	     	}
			   	     }
			   	  });
			   });
			   roleObject.push(rectObj);
		       connections.push(r.drawArr({
		           obj1: user,
		       	   obj2: rectObj
		   	   }));
	 	     }
	 	     // 用户连接角色的线条数
	 	     var userConnectRoleLines = connections.length;
	 	     user.mousemove(function() {
		        this.animate({
		            "fill-opacity": 0.5
		        },1,function(){
		        	for(var j = 0; j < userConnectRoleLines;j++){
	 	     			var ele = connections[j].arrPath;
	 	     			ele.attr({stroke:"green","stroke-width":3});
	 	     		}
		        });
		     });
		     user.mouseout(function() {
		        this.animate({
		            "fill-opacity": 0.1
		        },1,function(){
		        	for(var j = 0; j < userConnectRoleLines;j++){
	 	     			var ele = connections[j].arrPath;
	 	     			ele.attr({stroke:"green","stroke-width":1});
	 	     		}
		        });
		     });
		     
		    // 没有角色,不显示计算图标
		    if(roleDataJsonLength == 0){
		    	return;
		    } 
		    // 创建查看权限计算结果对象
		    // 前面的个数加2作为id(连线数以及用户一个)
		    var roleResultId = connections.length + 2;
		    var roleResultIdName = "test" + roleResultId;
		    var divQueryRoleResult = $('<div id='+roleResultIdName+' style="cursor:pointer;" class="test">查看权限计算结果</div>');
		    $("#holder").after(divQueryRoleResult);
		    $("#"+roleResultIdName).css("width","130px");
		    // 以角色图标最长的那个为准右移
		    var roleResultWidth = 460 + maxLength;
			var roleResult = r.rect(roleResultWidth, 245, 130, 20, 4);
			$("#"+roleResultIdName).offset({
				top:245+3,
				left:roleResultWidth +16
			});
			roleResult.attr({
				fill: "rgb(255,123,0)",
		        stroke: "rgb(255,123,0)",
		        "fill-opacity": 0.1,
		        "stroke-width": 2,
		        //cursor:"move"
			});
			roleResult.id = roleResultId;
			//roleResult.drag(move, dragger, up);
			roleResult.mousemove(function(){
				this.animate({
		            "fill-opacity": 0.5
		        },1,function(){
		        	for(var i = 0;i < permissionArray.length; i++){
		        		permissionArray[i].arrPath.attr({stroke:"green","stroke-width":3});
		        	}
		        });
			});
			roleResult.mouseout(function(){
				this.animate({
		            "fill-opacity": 0.1
		        },1,function(){
		        	for(var i = 0;i < permissionArray.length; i++){
		        		permissionArray[i].arrPath.attr({stroke:"green","stroke-width":1});
		        	}
		        });
			});
			$("#"+roleResultIdName).hover(function(){
				roleResult.animate({
		            "fill-opacity": 0.5
		        },1,function(){
		        	for(var i = 0;i < permissionArray.length; i++){
		        		permissionArray[i].arrPath.attr({stroke:"green","stroke-width":3});
		        	}
		        });
			},function(){
				roleResult.animate({
		            "fill-opacity": 0.1
		        },1,function(){
		        	for(var i = 0;i < permissionArray.length; i++){
		        		permissionArray[i].arrPath.attr({stroke:"green","stroke-width":1});
		        	}
		        });
			});
			// 角色连接查看权限计算
			for(var k = 0; k < roleObject.length; k++){
				connections.push(r.drawArr({
		           obj1: roleObject[k],
		       	   obj2: roleResult
		   	    }));
			}
			
			// 计算菜单权限id以及自定义权限id
			var funcResultId = roleResultId + 1;
			var customResultId = roleResultId + 2;
			// 存储菜单权限以及自定义权限两个对象
			var permissionArray = [];
			var funcPrivilegeArray = [];
			var customPrivilegeArray = []; 
			$("#"+roleResultIdName).one("click",function(){
					 // 取消手型
					 $("#"+roleResultIdName).css("cursor","");
					 // 菜单权限
					 var funcResultIdName = "test" + funcResultId;
		    		 var divFuncResult = $('<div id='+funcResultIdName+' class="test">菜单权限</div>');
		    		 $("#holder").after(divFuncResult);
					 var funcResult = r.rect(roleResultWidth+200, 130, 80, 20, 4);
					 $("#"+funcResultIdName).offset({
						top:130+3,
						left:roleResultWidth+200+16
					 });
					 funcResult.attr({
						fill: "rgb(175,50,204)",
		        		stroke: "rgb(175,50,204)",
		        		"fill-opacity": 0.1,
		        		"stroke-width": 2,
		        		//cursor:"move"
					 });
					 funcResult.id = funcResultId;
					 //funcResult.drag(move, dragger, up);
					 funcResult.mousemove(function(){
						this.animate({
		              	"fill-opacity": 0.5
		       	    	},1,function(){
		       	    		for(var i = 0;i < funcPrivilegeArray.length; i++){
		        				funcPrivilegeArray[i].arrPath.attr({stroke:"green","stroke-width":3});
		        			}
		       	    	});
					 });
					 funcResult.mouseout(function(){
						this.animate({
		             	 "fill-opacity": 0.1
		        		},1,function(){
		        			for(var i = 0;i < funcPrivilegeArray.length; i++){
		        				funcPrivilegeArray[i].arrPath.attr({stroke:"green","stroke-width":1});
		        			}
		        		});
					 });
					 var permissionConnectFunc = r.drawArr({
		          	 	obj1: roleResult,
		       	   		obj2: funcResult
		   	    	 });
		   	    	 permissionConnectFunc.arrPath.attr({stroke:"green","stroke-width":1});
					 connections.push(permissionConnectFunc);
					 permissionArray.push(permissionConnectFunc);
					  // 自定义权限
					 var customResultIdName = "test" + customResultId;
		    		 var divCustomResult = $('<div id='+customResultIdName+' class="test">自定义权限</div>');
		    		 $("#holder").after(divCustomResult);
					 var customResult = r.rect(roleResultWidth+200, 330, 90, 20, 4);
					 $("#"+customResultIdName).offset({
						top:330+3,
						left:roleResultWidth+200+16
					 });
					 customResult.attr({
						fill: "rgb(175,50,204)",
		        		stroke: "rgb(175,50,204)",
		        		"fill-opacity": 0.1,
		        		"stroke-width": 2,
		        		//cursor:"move"
					 });
					 customResult.id = customResultId;
					 //customResult.drag(move, dragger, up);
					 customResult.mousemove(function(){
						this.animate({
		              	"fill-opacity": 0.5
		       	    	},1,function(){
		       	    		for(var i = 0;i < customPrivilegeArray.length; i++){
		        				customPrivilegeArray[i].arrPath.attr({stroke:"green","stroke-width":3});
		        			}
		       	    	});
					 });
					 customResult.mouseout(function(){
						this.animate({
		             	 "fill-opacity": 0.1
		        		},1,function(){
		       	    		for(var i = 0;i < customPrivilegeArray.length; i++){
		        				customPrivilegeArray[i].arrPath.attr({stroke:"green","stroke-width":1});
		        			}
		       	    	});
					 });
		   	    	 var permissionConnectCustom = r.drawArr({
		          	 	obj1: roleResult,
		       	   		obj2: customResult
		   	    	 })
		   	    	 permissionConnectCustom.arrPath.attr({stroke:"green","stroke-width":1});
					 connections.push(permissionConnectCustom);
					 permissionArray.push(permissionConnectCustom);
					 
					 // 权限项间距
					 var privilegeInterval = 0;
					 if(allPrivilegeLength > 15){
	 	    			privilegeInterval = (590 + (allPrivilegeLength - 15)*35-70)/allPrivilegeLength;
	 	  			 }else{
	 	    			privilegeInterval = (590 - 70)/allPrivilegeLength;
	 	    		 }
					 for(var j = 0;j < funcPrivilegeDataLength;j++) {
							var funcPrivilegeName = funcPrivilegeData[j].name;
	 	       				var funcPrivilegePname = funcPrivilegeData[j].parentName;
	 	      				var extraFuncLength = 0;
		      				if(funcPrivilegeName.length > 3){
		    	  				extraFuncLength = (funcPrivilegeName.substring(3).length)*13;
		       				}
		       				var index = j + customResultId + 1;
	 	   	  				var divFuncPrivilege = $('<div id="test'+index+'" class="test" title="所属菜单组:'+funcPrivilegePname+'"><img style="margin-top:-4px" src="${ctxStatic}/image/funcitem.png"/>'+funcPrivilegeName+'</div>');
		   	  				$("#holder").after(divFuncPrivilege);
		   	   				var divObj = "#test" + index;
		   	   				var tempWidth = 80 + extraFuncLength;
		       				$(divObj).css("width",tempWidth + "px");
		   	   				var funcPrivilegeObj = r.rect(roleResultWidth+450, startY + j*privilegeInterval, tempWidth, 20, 4);
							$(divObj).offset({
				   				top:startY + j*privilegeInterval +3,
				   				left:roleResultWidth+450+16
			   				});
			  				funcPrivilegeObj.attr({
				 				fill: "rgb(241,200,19)",
		         				stroke: "rgb(241,200,19)",
		        				"fill-opacity": 0.1,
		        				"stroke-width": 2,
		        			  	"title":"所属菜单组:" + funcPrivilegePname,
		        				//cursor:"move"
			  				});
			  				funcPrivilegeObj.id = index;
			   				//funcPrivilegeObj.drag(move, dragger, up);
			   				funcPrivilegeObj.mousemove(function(){
			   					this.animate({
			   						"fill-opacity":0.5
			   					},1);
			   				});
			   				funcPrivilegeObj.mouseout(function(){
			   					this.animate({
			   						"fill-opacity":0.1
			   					},1);
			   				});
			   			    var funcPermissionConnect = r.drawArr({
		          	 			obj1: funcResult,
		       	   				obj2: funcPrivilegeObj
		   	    	 		});
		   	    	 		funcPermissionConnect.arrPath.attr({stroke:"green","stroke-width":1});
					 		connections.push(funcPermissionConnect);
					 		funcPrivilegeArray.push(funcPermissionConnect);
					 }
					 
					 for(var z = 0;z < customPrivilegeDataLength; z++){
					 	 var customPrivilegeName = customPrivilegeData[z].name;
	 	       			 var customPrivilegePname = customPrivilegeData[z].parentName;
	 	       			 var extraCustomLength = 0;
		      			 if(customPrivilegeName.length > 3){
		    	  				extraCustomLength = (customPrivilegeName.substring(3).length)*13;
		       			 }
		       			 var index  = funcPrivilegeDataLength + customResultId + 1 + z;
		       			 var variable = funcPrivilegeDataLength + z;
		       			 var divCustomPrivilege = $('<div id="test'+index+'" class="test" title="所属权限组:'+customPrivilegePname+'"><img style="margin-top:-4px" src="${ctxStatic}/image/priItem.png"/>'+customPrivilegeName+'</div>');
		   	  				$("#holder").after(divCustomPrivilege);
		   	   				var divObj = "#test" + index;
		   	   				var tempWidth = 80 + extraCustomLength;
		       				$(divObj).css("width",tempWidth + "px");
		   	   				var customPrivilegeObj = r.rect(roleResultWidth+450, startY + variable*privilegeInterval, tempWidth, 20, 4);
							$(divObj).offset({
				   				top:startY + variable*privilegeInterval +3,
				   				left:roleResultWidth+450+16
			   				});
			  				customPrivilegeObj.attr({
				 				fill: "rgb(0,161,255)",
		         				stroke: "rgb(0,161,255)",
		        				"fill-opacity": 0.1,
		        				"stroke-width": 2,
		        			  	"title":"所属权限组:" + customPrivilegePname,
		        				//cursor:"move"
			  				});
			  				customPrivilegeObj.id = index;
			   				//customPrivilegeObj.drag(move, dragger, up);
			   				customPrivilegeObj.mousemove(function(){
			   					this.animate({
			   						"fill-opacity":0.5
			   					},1);
			   				});
			   				customPrivilegeObj.mouseout(function(){
			   					this.animate({
			   						"fill-opacity":0.1
			   					},1);
			   				});
			   			    var customPermissionConnect = r.drawArr({
		          	 			obj1: customResult,
		       	   				obj2: customPrivilegeObj
		   	    	 		});
		   	    	 		customPermissionConnect.arrPath.attr({stroke:"green","stroke-width":1});
					 		connections.push(customPermissionConnect);
					 		customPrivilegeArray.push(customPermissionConnect);
					 }
			});
			
			// 所有线条上色
			for(var j = 0; j < connections.length;j++){
	 	     	var ele = connections[j].arrPath;
	 	     	ele.attr({stroke:"green","stroke-width":1});
	 	    }
	 })
	   
	   // 画线
	   Raphael.fn.drawArr = function (obj) {
            var point = getStartEnd(obj.obj1, obj.obj2);
            var path1 = getArr(point.start.x, point.start.y, point.end.x, point.end.y,point.start.a1, point.start.b1,point.start.a2, point.start.b2, 8);
            if (obj.arrPath) {
                obj.arrPath.attr({ path: path1 });
            } else {
                obj.arrPath = this.path(path1);
            }
            return obj;
        };
        
        // 动态确定起点和终点
        function getStartEnd(obj1, obj2) {
            var bb1 = obj1.getBBox(),
                bb2 = obj2.getBBox();
            var p = [
                    { x: bb1.x + bb1.width / 2, y: bb1.y - 1 },
                    { x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1 },
                    { x: bb1.x - 1, y: bb1.y + bb1.height / 2 },
                    { x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2 },
                    { x: bb2.x + bb2.width / 2, y: bb2.y - 1 },
                    { x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1 },
                    { x: bb2.x - 1, y: bb2.y + bb2.height / 2 },
                    { x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2 }
                ];
            var d = {}, dis = [];
            for (var i = 0; i < 4; i++) {
                for (var j = 4; j < 8; j++) {
                    var dx = Math.abs(p[i].x - p[j].x),
                        dy = Math.abs(p[i].y - p[j].y);
                    if (
                         (i == j - 4) ||
                         (((i != 3 && j != 6) || p[i].x < p[j].x) &&
                         ((i != 2 && j != 7) || p[i].x > p[j].x) &&
                         ((i != 0 && j != 5) || p[i].y > p[j].y) &&
                         ((i != 1 && j != 4) || p[i].y < p[j].y))
                       ) {
                        dis.push(dx + dy);
                        d[dis[dis.length - 1]] = [i, j];
                    }
                }
            }
            if (dis.length == 0) {
                var res = [0, 4];
            } else {
                res = d[Math.min.apply(Math, dis)];
            }
            var x1 = p[res[0]].x,
        	    y1 = p[res[0]].y,
       	        x4 = p[res[1]].x,
        		y4 = p[res[1]].y;
            dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    		dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    		var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        	    y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        		x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
       		    y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
            var result = {};
            result.start = {};
            result.end = {};
            result.start.x = p[res[0]].x;
            result.start.y = p[res[0]].y;
            result.start.a1 = x2;
            result.start.b1 = y2;
            result.start.a2 = x3;
            result.start.b2 = y3;
            result.end.x = p[res[1]].x;
            result.end.y = p[res[1]].y;
            return result;
        }
        
        // 确定箭头路径
        function getArr(x1, y1, x2, y2, a1, b1, a2, b2, size) {
            var angle = Raphael.angle(x1, y1, x2, y2);//得到两点之间的角度
            var a45 = Raphael.rad(angle - 45);//角度转换成弧度
            var a45m = Raphael.rad(angle + 45);
            var x2a = x2 + Math.cos(a45) * size;
            var y2a = y2 + Math.sin(a45) * size;
            var x2b = x2 + Math.cos(a45m) * size;
            var y2b = y2 + Math.sin(a45m) * size;
            var result = ["M", x1.toFixed(3), y1.toFixed(3), "C", a1, b1, a2, b2, x2, y2, "L", x2a, y2a, "M", x2, y2, "L", x2b, y2b];
            return result;
        }
</script>
</head>
<body>
	<div id="box" style="position:absolute;">
	 <div id="holder" style="cursor:move"></div>
	</div>
	<script type="text/javascript">
		$(function() {
			$("#holder").mousedown(function(){
				var parentFrame =  parent.window.frames['permissionContent'];  
				var scrollHeight = parentFrame.contentWindow.document.body.scrollHeight;
				var clientHeight = parentFrame.contentWindow.document.body.clientHeight;
				var scrollWidth = parentFrame.contentWindow.document.body.scrollWidth;
				var clientWidth = parentFrame.contentWindow.document.body.clientWidth;
				var top = parentFrame.contentWindow.document.body.scrollTop;
				var left = parentFrame.contentWindow.document.body.scrollLeft;
				if(scrollHeight <= clientHeight && scrollWidth <= clientWidth){
					return;
				}
				this._moveflag = true;
				this.style.cursor="move";
				this._ptx = event.clientX;
				this._pty = event.clientY;
				this._proleft = left;
				this._protop = top;
			});
			
			$("#holder").mousemove(function(){
				var parentFrame =  parent.window.frames['permissionContent'];
				if(!this._moveflag){
					return;
				}
				parentFrame.contentWindow.document.body.scrollLeft = this._proleft - (event.clientX - this._ptx);
				parentFrame.contentWindow.document.body.scrollTop = this._protop - (event.clientY - this._pty);
			});
			
			$("#holder").mouseup(function(){
				this._moveflag = false;
				var parentFrame =  parent.window.frames['permissionContent'];
				parentFrame.contentWindow.document.body.scrollLeft = this._proleft - (event.clientX - this._ptx);
				parentFrame.contentWindow.document.body.scrollTop = this._protop - (event.clientY - this._pty);
			});
		});
	</script>
</body>
</html>
