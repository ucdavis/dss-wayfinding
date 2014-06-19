<?php

class AuthFilter extends CFilter
{
	protected function preFilter($filterChain)
	{
		$authorized = false;

		//Yii's autoloader breaks phpCAS's autoloader.
		spl_autoload_unregister(array('YiiBase','autoload'));
		require_once('CAS.php');
		spl_autoload_register(array('YiiBase','autoload'));

		// Initialize phpCAS
		phpCAS::client(CAS_VERSION_2_0, CAS_HOST, CAS_PORT, CAS_CONTEXT);

		// For production use set the CA certificate that is the issuer of the cert
		// on the CAS server and uncomment the line below
		// phpCAS::setCasServerCACert($cas_server_ca_cert_path);

		// For quick testing you can disable SSL validation of the CAS server.
		// THIS SETTING IS NOT RECOMMENDED FOR PRODUCTION.
		// VALIDATING THE CAS SERVER IS CRUCIAL TO THE SECURITY OF THE CAS PROTOCOL!
		phpCAS::setNoCasServerValidation();

		// force CAS authentication
		phpCAS::forceAuthentication();

		//Roles Management code checks if user is in appropriate group
		//Specified in protected/config/main.php
		$url = "https://" . ROLES_MANAGEMENT_API . "/people/" . phpCAS::getUser() . ".json";

		$httpauth = ROLES_MANAGEMENT_APPNAME . ":" . ROLES_MANAGEMENT_SECRET;
		$header = array("Accept" => "application/vnd.roles-management.v1");

		$ch = curl_init($url);

		curl_setopt($ch, CURLOPT_USERPWD, $httpauth);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

		$curlresult = curl_exec($ch);

		curl_close($ch);

		$roles = json_decode($curlresult);
		if (isset($roles->group_memberships)) {
			foreach ($roles->group_memberships as $group) {
				if ($group->group_id == MANAGEMENT_GROUP) {
					$authorized = true;
				}
			}
		}

		if (!$authorized) {
			echo "<h1>Not Authorized to Manage LCD Screens</h1>";
		}

		//When false, no further code will execute.
		return $authorized;
	}
}

?>
