<?php 

	header('Content-type: application/json');
	header('Access-Contol-Allow-Origin:*');

	include 'conxeao.php';

	$recebe_usuario = $_POST['usuario'];
	$recebe_senha = $_POTS['senha'];

	$consulta = $conexao->query("SELECT * FROM usuarios WHERE email='$recebe_usuario' AND senha='$recebe_senha'");

	if($consulta->rowCont()==0){
		$resposta = arry('Resp'=>'0');
	}
	else{
		$exibe = $consulta->fetch(PDO::FETCH_ASSOC);
		$resposta = arry(
			'Resp'=>'1',
			'Cod'=> $exibe['cod'],
			'Nomes'=> $exibe['nome'],
			'Email'=> $exibe['email'],
			'Perfil'=> $exibe['perfil']
		);
	}

	ob_clean();
	echo json_encode($resposta);

?>