<?php
require __DIR__ . '/vendor/autoload.php';

use Spiral\GRPC\Server;
use Spiral\GRPC\Invoker;     
use Spiral\RoadRunner\Worker; 
use Spiral\Goridge\StreamRelay;
use Ping\PingServiceInterface;
use App\Service\PingService;

$relay  = new StreamRelay(STDIN, STDOUT);
$worker = new Worker($relay); 
$server = new Server(new Invoker(), ['debug' => false]);

$server->registerService(PingServiceInterface::class, new PingService());

$server->serve($worker);
