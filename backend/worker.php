<?php
require DIR . '/vendor/autoload.php';

use Spiral\GRPC\Server;
use Spiral\RoadRunner\Worker;
use Psr\Log\NullLogger;
use App\Service\PingService;
use Ping\PingServiceInterface;

$server = new Server(new NullLogger());
$server->registerService(PingServiceInterface::class, new PingService());

$worker = Worker::create();
$server->serve($worker);