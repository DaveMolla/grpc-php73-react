<?php
use PHPUnit\Framework\TestCase;
use App\Service\PingService;
use Ping\PingRequest;
use Spiral\GRPC\Context;

final class PingServiceTest extends TestCase
{
    public function testPingReturnsSameMessage(): void
    {
        $svc = new PingService();
        $req = new PingRequest();
        $req->setMessage("hello");
        $res = $svc->Ping(new Context([]), $req);
        $this->assertSame("hello", $res->getMessage());
    }
}