import { Patterns } from "./patterns";
import { default as emoji } from 'node-emoji';
import { default as date } from 'date-and-time';
const two_digit_year = require('date-and-time/plugin/two-digit-year');
date.plugin(two_digit_year);

export class ChatStats {
    default_options: any = {
        url_list_unique: true,
        domain_list_unique: true
    }
    options: any;
    patterns: any;

    line: string;
    line_type: string;
    line_message: string;
    line_message_without_emoji: string;
    line_url: string;
    line_author: string;
    line_timedate: any;
    line_contains_emoji: boolean;
    line_emoji: any;

    chat_messages: number = 0;
    chat_deleted_messages: number = 0;
    chat_messages_by_name: any = {};
    chat_emoji_by_name: any = {};
    chat_emoji_type_by_name: any = {};
    chat_urls: string[] = [];
    chat_urls_by_name: any = {};
    chat_domains: string[] = [];
    chat_domains_by_name: any = {};
    chat_dates: any = [];

    constructor(options = {}) {
        this.patterns = Patterns;
        this.options = Object.assign({}, this.default_options, options);
    }

    reset_chat_counters() {
        this.chat_messages = 0;
        this.chat_deleted_messages = 0;
        this.chat_messages_by_name = {};
        this.chat_emoji_by_name = {};
        this.chat_emoji_type_by_name = {};
        this.chat_urls = [];
        this.chat_urls_by_name = {};
        this.chat_domains = [];
        this.chat_domains_by_name = {};
        this.chat_dates = [];
    }

    check_regex_list(regex_list: any, line: string): Boolean {
        return regex_list.some((regex: string) => {
            return line.match(regex);
        });
    }

    check_patterns_list(patterns: any): any {
        Object.entries(patterns).forEach((val: any) => {
            let event_type: string = val[0];
            let event_patterns: any = val[1];

            event_patterns.forEach((regex: any) => {
                let result = this.line.match(regex);
                if(result !== null){
                    try {
                        this.line_author = this.line.split(result[0])[0].split(" - ")[1].split(":")[0];
                    } catch (error) {
                        this.line_author = "system";
                    }
                    this.line_type = event_type;
                    this.line_message = this.line.split(" - ")[1];
                    if(this.line_message.includes(":")){
                        this.line_message = this.line_message.split(": ")[1];
                    }
                }
            });
        });
    }

    parse_line(line: string): object {
        this.line = line;
        this.line_type = undefined;
        this.line_url = undefined;
        try {
            this.line_message = emoji.unemojify(line.split(/- (.*)/)[1].split(/: (.*)/)[1]);
            this.line_author = emoji.unemojify(line.split(/- (.*)/)[1].split(/: (.*)/)[0]);
        } catch (error) {
            console.error(error);
        }
        if(line.match(this.patterns.IS_URL) && !this.check_regex_list(this.patterns.ATTACHMENTS.contact_card, line)){
            this.line_url = line.match(this.patterns.IS_URL)[0];
            let domain: string = new URL(this.line_url).hostname;
            if(this.options.url_list_unique ? !this.chat_urls.includes(this.line_url) : true){
                this.chat_urls.push(this.line_url);
            }
            if(this.options.domain_list_unique ? !this.chat_domains.includes(domain) : true){
                this.chat_domains.push(domain);
            }

            if(isNaN(this.chat_urls_by_name[this.line_author])) this.chat_urls_by_name[this.line_author] = 0;
            this.chat_urls_by_name[this.line_author]++;

            if(this.chat_domains_by_name[this.line_author] == undefined) this.chat_domains_by_name[this.line_author] = {};
            if(isNaN(this.chat_domains_by_name[this.line_author][domain])) this.chat_domains_by_name[this.line_author][domain] = 0;
            this.chat_domains_by_name[this.line_author][domain]++;
            
            if(this.line_message == this.line_url) { //message contains only a link
                this.line_type = "url";
            } else {
                this.line_type = "chat_with_url";
            }
        } else if(this.check_regex_list(this.patterns.IS_DELETED_CHAT, line)) {
            this.line_type = "deleted_chat";
            this.chat_deleted_messages++;
        } else if(line.match(this.patterns.IS_CHAT)) {
            this.line_type = "chat";
        }

        this.check_patterns_list(this.patterns.EVENTS);
        this.check_patterns_list(this.patterns.ATTACHMENTS);

        try {
            this.line_timedate = date.parse(this.line.split(" - ")[0], 'DD/MM/YY, HH:mm', true);
            if(isNaN(this.line_timedate) === false) this.chat_dates.push(this.line_timedate);
        } catch (error) {
            console.log(error);
            this.line_timedate = undefined;
        }

        if(this.line_type !== undefined && typeof(this.line_author) == "string"){
            this.chat_messages++;
            if(isNaN(this.chat_messages_by_name[this.line_author])) this.chat_messages_by_name[this.line_author] = 0;
            this.chat_messages_by_name[this.line_author]++;
        }

        try{
            let emoji_list: any = [];
            this.line_message_without_emoji = emoji.replace(this.line_message, (current_emoji: any) => { emoji_list.push(current_emoji.key); return ''; });
            this.line_emoji = emoji_list;
            this.line_contains_emoji = emoji_list.length > 0;
            this.line_emoji.forEach((element: string) => {
                if(isNaN(this.chat_emoji_by_name[this.line_author])) this.chat_emoji_by_name[this.line_author] = 0;
                this.chat_emoji_by_name[this.line_author]++;

                if(this.chat_emoji_type_by_name[this.line_author] == undefined) this.chat_emoji_type_by_name[this.line_author] = {};
                if(isNaN(this.chat_emoji_type_by_name[this.line_author][element])) this.chat_emoji_type_by_name[this.line_author][element] = 0;
                this.chat_emoji_type_by_name[this.line_author][element]++;
            });
        } catch(error) {
            console.log(error);
        }

        return {
            type: this.line_type,
            message: this.line_message,
            message_without_emoji: this.line_message_without_emoji,
            contains_emoji: this.line_contains_emoji,
            emoji: this.line_emoji,
            url: this.line_url,
            author: this.line_author,
            timedate: this.line_timedate
        };
    }
}