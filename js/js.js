window.onload=function(){
	$("#cabecalho, #user, #Pub, #foto, #novocadastro").hide();
	$('#exibeFoto').attr('src','');
	$('#btnCadastrar').attr('disabled','disabled');

	$("#cad_email").change(function() {
        
        if($("#cad_email").val()=="" || $("#cad_email").val().indexOf('@')==-1 || $("#cad_email").val().indexOf('.')==-1){
			navigator.notification.alert('Por favor, informe um E-MAIL válido!','','Mensagem');
        	$("#cad_email").focus();
		} else{
	        $.ajax({
	            url:'http://curso.dopcomunicacao.com.br/verificaEmail.php',
	            dataType:'json',
	            type:'POST',
	            data:{email:$("#cad_email").val()},
	            success: function(r){
	                if (r.Resp==1) {
	                    $("#mensagem").html("E-mail/usuário já cadastrado!!!");
	                    $('#btnCadastrar').attr('disabled','disabled');
	                }
	                else if(r.Resp==0) {
	                    $("#mensagem").html("E-mail/usuário disponível!!");
	                    $('#btnCadastrar').removeAttr('disabled');
	                }
	            },
	            error:function(){
	            	navigator.notification.alert('Erro de conexão com o bando de dados!!','','Mensagem');
	            	$('#btnCadastrar').attr('disabled','disabled');
	            }
	        })
    	}
    });
}

function verificaUsuario(){
	$.ajax({
		// url:'http://phonegap_conexao.loc/consultarUser.php',
		url:'http://curso.dopcomunicacao.com.br/consultarUser.php',
		dataType: 'json',
		type: 'POST',
		data:{
			usuario: $('#usuario').val(),
			senha: $('#senha').val()
		},
		success: function(r){
			if(r.Resp==0){
				navigator.notification.alert('Usuário e/ou Senha não encontrados!!','','Mensagem');
			}
			else if(r.Resp==1){
				localStorage.setItem('Cod', r.Cod);
				localStorage.setItem('Nome', r.Nome);
				localStorage.setItem('Email', r.Email);
				localStorage.setItem('Perfil', r.Perfil);

				inicio();
			}
		},
		error: function(e){
			navigator.notification.alert('Houve um erro de conexão com o banco de dados!!','','Erro');
		}
	})
}
function inicio(){
	$("#cabecalho, #user").show();
	$("#logon").hide();

	var Nome = localStorage.getItem('Nome');
	var Perfil = localStorage.getItem('Perfil');

	// var foto = "<img class=foto src=http://phonegap_conexao.loc/uploads/" + Perfil + " width=80%>";
	var foto = "<img class=foto src=http://curso.dopcomunicacao.com.br/uploads/" + Perfil + " width=80%>";
	var nome = "Nome: " + Nome + "<br><br>";

	$("#Perfil").html(foto);
	$("#Nome").html(nome);

	publicacoes();
}

function publicacoes(){
	var cod=localStorage.getItem('Cod');
	var id=0;

	$.ajax({
		// url:'http://phonegap_conexao.loc/consultarPostagens.php',
		url:'http://curso.dopcomunicacao.com.br/consultarPostagens.php',
		dataType:'json',
		success: function(r){
			// console.log(r);
			var total = r.length;
			var i;
			var postagens = "";

			for (i=0;i<total;i++){
				// postagens+= "<div style='width:100%;text-align:center;margin-top:20px'><img class='perfil' src='http://phonegap_conexao.loc/uploads/" + r[i].img_user + "' alt='" + r[i].usuario + "' />";
				postagens+= "<div style='width:100%;text-align:center;margin-top:20px'><img class='perfil' src='http://curso.dopcomunicacao.com.br/uploads/" + r[i].img_user + "' alt='" + r[i].usuario + "' />";
				postagens+= "<br>" + r[i].usuario + "</div>";
				// postagens+= "<div style='width:100%'><img src='http://phonegap_conexao.loc/uploads/" + r[i].imagem + "' width=100% /></div>";
				postagens+= "<div style='width:100%'><img src='http://curso.dopcomunicacao.com.br/uploads/" + r[i].imagem + "' width=100% /></div>";
				
				if (cod==r[i].id_user) {
                        id=r[i].cod_pub;
                        postagens+="<div style='width=100%;margin-top:5px'><a href='#' class='ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-notext' onclick=excluir(" +id + ")>Delete</a></div>"; 
                }

				postagens+= "<div style='width:100%;text-align:center;margin-top:10px'><span>" + r[i].comentario + "</span></div>";

				$('#Pub').html(postagens).show();
			}
		},
		error: function(e){
			navigator.notification.alert('Houve um erro de conexão com o banco de dados!!','','Erro');
		}
	})
}

function publicar(){
    navigator.notification.confirm(
    'Nova foto ou abrir a galeria?',
    resposta,
    'Publicação',
    ['Galeria','Câmera']
    )
}
            
function resposta(r){
            
    if (r==2){
        fazFoto();
    }
	else if(r==1){
		abrirGaleria();
    }
}

function fazFoto(){
    
     var opFoto = {
     quality:50,
     sourceType:Camera.PictureSourceType.CAMERA,
     destinationType:Camera.DestinationType.FILE_URI,
     saveToPhotoAlbum:true,
     encodingType:Camera.EncodingType.JPEG,
     mediaType:Camera.MediaType.PICTURE,
     targetWidth:1200,
     targetHeight:800
     }
            
     navigator.camera.getPicture(fotoSucesso,fotoErro,opFoto);            
}
            
            
function fotoSucesso(foto) {
    $("#Pub").hide();
    $("#foto").show();
    $("#exibeFoto").attr('src',foto);
    localStorage.setItem('foto',foto);
    nomeFoto();	
            
}
            
function fotoErro(e) {
    navigator.notification.alert('Houve um erro ao tentar acessar a câmera! Tente Novamente!','','Erro');
}

function abrirGaleria(){
            
    var opFoto = {
    quality:50,
    sourceType:Camera.PictureSourceType.PHOTOLIBRARY,
    destinationType:Camera.DestinationType.FILE_URI,
    mediaType:Camera.MediaType.PICTURE
    }
            
    navigator.camera.getPicture(galeriaSucesso,galeriaErro, opFoto);
}
            
            
function galeriaSucesso(foto){
    $("#exibeFoto").attr('src', foto);
    $("#Pub").hide();
    $("#foto").show();
    $("#exibeFoto").attr('src',foto);
    
    localStorage.setItem('foto',foto);
    nomeFoto();	
            
}
            
function galeriaErro(e) {
    navigator.notification.alert('Houve um erro ao tentar acessar a galeria! Tente Novamente!','','Erro');
}

function nomeFoto() {
    var letras = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    var nomeFoto = '';
    for (var i = 0; i < 55; i++) {
        var rnum = Math.floor(Math.random() * letras.length);
        nomeFoto += letras.substring(rnum, rnum + 1);
    }

    localStorage.setItem('nomeFoto',nomeFoto+'.jpg');
}

function upload(){
 
 var foto = localStorage.getItem('foto');   
 var nomeFoto = localStorage.getItem('nomeFoto');
 var cod = localStorage.getItem('Cod');
    
 var options = new FileUploadOptions();
 options.fileKey = "file";
 options.fileName = nomeFoto;
 options.mimeType = "image/jpeg";
    
 var params = new Object();
 params.value1 = $("#comentario").val();
 params.value2 = cod;
 options.params = params;
 options.chunkedMode = false;

var ft = new FileTransfer();
 ft.upload(foto, "http://curso.dopcomunicacao.com.br/publica.php", function(){
     $("#foto").hide();
     publicacoes();
 }, function(){
 
     navigator.notification.alert('Houve um erro ao tentar publicar! Tente Novamente!','','Erro');
            
 }, options);
}

function excluir(r){
    localStorage.setItem('excluir',r);
    
    navigator.notification.confirm(
    'Excluir a Publicação?',
    respostaExc,
    'Exclusão',
    ['Não','Sim']
    )
}
    
function respostaExc(r){  
    
    if (r==2) {
    
        var registro = localStorage.getItem('excluir');
        
    $.ajax({
        url:'http://curso.dopcomunicacao.com.br/excluir.php',
        dataType:'json',
        type:'POST',
        data:{id:registro},
        success:function(resposta){
            navigator.notification.alert('Publicação excluída com sucesso!!','','Mensagem');
            localStorage.removeItem('excluir');
            publicacoes();
        },
        error: function(){
            navigator.notification.alert('Houve um erro ao tentar excluir! Tente Novamente!','','Erro');
        }
        
    })
        
    }
}

function cadastro(){
    $("#logon").hide();
    $("#cabecalho, #novocadastro").show();    
}

function fotoPerfil(){
    
    var opFoto = {
    quality:50,
    sourceType:Camera.PictureSourceType.PHOTOLIBRARY,
    destinationType:Camera.DestinationType.FILE_URI,
    mediaType:Camera.MediaType.PICTURE
    }
            
    navigator.camera.getPicture(perfilSucesso,perfilErro, opFoto);
}
    

function perfilSucesso(foto){
    localStorage.setItem('foto',foto);
    $("#fotoPerfil").html("<img src='" + foto + "' width=170px height=150px>");
    nomeFoto();	
            
}
            
function perfilErro(e) {
    navigator.notification.alert('Houve um erro ao tentar acessar a galeria! Tente Novamente!','','Erro');
}

function cadastraUsuario(){
    
    var foto = localStorage.getItem('foto');
    
    
    if($("#cad_nome").val()=="" || $("#cad_email").val()=="" ||  $("#cad_senha").val()=="" || foto==null) {
        
        alert ("Verifique os dados cadastrados!!");
    }else {
        
         var nomeFoto = localStorage.getItem('nomeFoto');
         

         var options = new FileUploadOptions();
         options.fileKey = "file";
         options.fileName = nomeFoto;
         options.mimeType = "image/jpeg";

         var params = new Object();
         params.value1 = $("#cad_nome").val();
         params.value2 = $("#cad_email").val();
         params.value3 = $("#cad_senha").val();
         options.params = params;
         options.chunkedMode = false;

        var ft = new FileTransfer();
         ft.upload(foto, "http://curso.dopcomunicacao.com.br/insereUser.php", function(){
             
             navigator.notification.alert('Cadastro efetuado com sucesso!!','','Mensagem');
             
             $("#novocadastro").hide();
             $("#logon").show();
             localStorage.removeItem('nomeFoto');
             localStorage.removeItem('foto');
         }, function(){

             navigator.notification.alert('Houve um erro ao tentar publicar! Tente Novamente!','','Erro');

         }, options);
        }
}

function sair(){
    navigator.notification.confirm(
    'Deseja sair?',
    respostaSair,
    'Sair',
    ['Não','Sim']
    )
}

function respostaSair(r){
	if (r==2){
		localStorage.clear();
		$("#cabecalho, #user, #Pub").hide();
		$("#logon").show();
	}
}