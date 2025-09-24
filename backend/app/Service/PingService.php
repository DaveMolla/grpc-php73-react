<?php
namespace App\Service;

use Ping\PingServiceInterface;
use Ping\PingRequest;
use Ping\PingReply;
use Spiral\GRPC\ContextInterface;

class PingService implements PingServiceInterface
{
    public function Ping(ContextInterface $ctx, PingRequest $in): PingReply
    {
        $out = new PingReply();
        $out->setMessage($in->getMessage());
        return $out;
    }
}