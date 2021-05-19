import { Patterns } from "./patterns";
import { default as nodeEmoji } from 'node-emoji';
import { default as date } from 'date-and-time';
const two_digit_year = require('date-and-time/plugin/two-digit-year');
date.plugin(two_digit_year);

enum MessageType {
    event,
    chat,
    deleted_chat,
    chat_with_url,
    url,
    attachment
}

interface Message {
    line: string;
    type: MessageType;
    line_without_emoji: string;
    url: string;
    author: string;
    timedate: Date;
    contains_emoji: boolean;
    emoji: any;
}

interface Counter {
    messages: number;
    deleted_messages: number;
    messages_by_name: any;
    emoji_by_name: any;
    emoji_by_type: any;
    emoji_type_by_name: any;
    urls: string[];
    urls_by_name: any;
    domains: string[];
    domains_by_name: any;
    dates: Date[];
}

interface Options {
    url_list_unique: boolean,
    domain_list_unique: boolean
}

export class ChatStats {
    default_options: Options = {
        url_list_unique: true,
        domain_list_unique: true
    }
    options: Options;
    patterns: any;

    message: Message;
    counter: Counter;

    reset_counter() {
        this.counter = {
            messages: 0,
            deleted_messages: 0,
            messages_by_name: [],
            emoji_by_name: [],
            emoji_by_type: [],
            emoji_type_by_name: [],
            urls: [],
            urls_by_name: [],
            domains: [],
            domains_by_name: [],
            dates: []
        };
    }

    constructor(options = {}) {
        this.patterns = Patterns;
        this.options = Object.assign({}, this.default_options, options);
        this.reset_counter();
    }

    check_regex_list(regex_list: any, line: string): Boolean {
        return regex_list.some((regex: string) => {
            return line.match(regex);
        });
    }

    check_pattern_list(pattern_list: any, line: string): Boolean {
        let found = false;
        Object.entries(pattern_list).forEach((regex_list: any) => {
            regex_list[1].some((regex: string) => {
                if(line.match(regex)){ found = true; return true; };
            });
        });
        return found;
    }

    parse_line(line: string): Message {
        let type = "chat";
        let line_without_emoji = line;
        let url = undefined;
        let author = "system";
        let timedate: Date = new Date();
        let contains_emoji = false;
        let emoji_list: any[] = [];

        if(line.includes(", ") && line.includes(" - ")){
            timedate = date.parse(line.split(" - ")[0], 'DD/MM/YY, HH:mm', true);
            if(timedate instanceof Date) this.counter.dates.push(timedate);

            author = line.split(" - ")[1].split(":")[0];
            if(line.match(this.patterns.IS_URL) && !this.check_regex_list(this.patterns.ATTACHMENTS.contact_card, line)){
                url = line.match(this.patterns.IS_URL)[0];
                let domain: string = new URL(url).hostname;
                if(this.options.url_list_unique ? !this.counter.urls.includes(url) : true){
                    this.counter.urls.push(url);
                }
                if(this.options.domain_list_unique ? !this.counter.domains.includes(domain) : true){
                    this.counter.domains.push(domain);
                }

                if(line.split(" - ")[1].split(": ")[1] == url) { //message contains only a link
                    type = "url";
                } else {
                    type = "chat_with_url";
                }

                if(isNaN(this.counter.urls_by_name[author])) this.counter.urls_by_name[author] = 0;
                this.counter.urls_by_name[author]++;

                if(this.counter.domains_by_name[author] == undefined) this.counter.domains_by_name[author] = {};
                if(isNaN(this.counter.domains_by_name[author][domain])) this.counter.domains_by_name[author][domain] = 0;
                this.counter.domains_by_name[author][domain]++;
            } else if(this.check_regex_list(this.patterns.IS_DELETED_CHAT, line)) {
                type = "deleted_chat";
                this.counter.deleted_messages++;
            } else if(this.check_pattern_list(this.patterns.EVENTS, line)){
                type = "event";
                author = "system";
            } else if(this.check_pattern_list(this.patterns.ATTACHMENTS, line)){
                type = "attachment";
            } else if(line.match(this.patterns.IS_CHAT)) {
                type = "chat";
            }

            if(type !== undefined && typeof(author) == "string"){
                this.counter.messages++;
                if(isNaN(this.counter.messages_by_name[author])) this.counter.messages_by_name[author] = 0;
                this.counter.messages_by_name[author]++;
            }

            try{
                line_without_emoji = nodeEmoji.replace(line, (current_emoji: any) => { emoji_list.push(current_emoji.key); return ''; });
                contains_emoji = emoji_list.length > 0;
                emoji_list.forEach((element: string) => {
                    if(isNaN(this.counter.emoji_by_name[author])) this.counter.emoji_by_name[author] = 0;
                    this.counter.emoji_by_name[author]++;
    
                    if(isNaN(this.counter.emoji_by_type[element])) this.counter.emoji_by_type[element] = 0;
                    this.counter.emoji_by_type[element]++;
    
                    if(this.counter.emoji_type_by_name[author] == undefined) this.counter.emoji_type_by_name[author] = {};
                    if(isNaN(this.counter.emoji_type_by_name[author][element])) this.counter.emoji_type_by_name[author][element] = 0;
                    this.counter.emoji_type_by_name[author][element]++;
                });
            } catch(error) {
                console.log(error);
            }
        }

        return {
            line: line,
            type: type as unknown as MessageType,
            line_without_emoji: line_without_emoji,
            url: url,
            author: author,
            timedate: timedate,
            contains_emoji: contains_emoji,
            emoji: emoji_list
        };
    }
}
