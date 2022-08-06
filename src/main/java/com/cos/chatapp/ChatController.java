package com.cos.chatapp;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@RestController // 데이터 리턴 서버
public class ChatController {

    private final ChatRepository chatRepository;

    @GetMapping(value = "/sender/{sender}/receiver/{receiver}", produces = MediaType.TEXT_EVENT_STREAM_VALUE) // MediaType.TEXT_EVENT_STREAM_VALUE -> SSE 프로토콜
    public Flux<Chat> getMsg(@PathVariable String sender, @PathVariable String receiver) { //Flux -> 데이터를 지속적으로 끝없이 흘려보내고 있음(화면 보면 계속 로딩중인데, 채팅 받을 준비를 하고 있는 느낌임)
         return chatRepository.mFindBySender(sender, receiver)
                .subscribeOn(Schedulers.boundedElastic());
    }

    @PostMapping("/chat")
    public Mono<Chat> setMsg(@RequestBody Chat chat) {  //save 한 데이터가 질 저장됬나 보고 싶어서 Mono 타입으로 return한것
        chat.setCreatedAt(LocalDateTime.now());
        return chatRepository.save(chat);
    }
}
