<?php
/**
 * Implementation of data field requests.
 *
 * @package    Dotdigital_WordPress
 */

namespace Dotdigital_WordPress\Includes\Client;

use Dotdigital\V2\Resources\AddressBooks;
use Dotdigital_WordPress\Includes\Setting\Dotdigital_WordPress_Config;

class Dotdigital_WordPress_Datafields {

	/**
	 * Dotdigital client.
	 *
	 * @var Dotdigital_WordPress_Client $dotdigital_client
	 */
	private $dotdigital_client;

	/**
	 * Construct.
	 */
	public function __construct() {
		$this->dotdigital_client = new Dotdigital_WordPress_Client();
	}

	/**
	 * Get Data Fields.
	 *
	 * @return array
	 * @throws \Http\Client\Exception If request fails.
	 */
	public function get() {
		$data_fields = get_transient( 'dotdigital_wordpress_api_data_fields' );
		if ( ! $data_fields ) {
			$data_fields = array();
			try {
				$response = $this->dotdigital_client->get_client()->dataFields->show();
				foreach ( $response->getList() as $data_field ) {
					$data_fields[ $data_field->getName() ] = $data_field;
				}
			} catch ( \Exception $exception ) {
				throw $exception;
			}
			set_transient(
				'dotdigital_wordpress_api_data_fields',
				$data_fields,
				Dotdigital_WordPress_Config::CACHE_LIFE
			);
		}
		return $data_fields;
	}
}
