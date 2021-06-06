const repl = require('repl');
const process = require('process'); 
chat_stats = require('../dist/main.js');
var fs = require('fs'),
    es = require('event-stream');

ChatStats = new chat_stats.ChatStats();
var lines = [];

//var path = "chats\\downloaded\\example.txt";
var path = "chats\\downloaded\\example_minimal.txt";
var orginal_file_copy_path = "orig_chat.txt";
var output_path = "chat.csv";

if (fs.existsSync(orginal_file_copy_path)) fs.unlinkSync(orginal_file_copy_path);
var outputStreamOriginalCopy = fs.createWriteStream(orginal_file_copy_path, {flags:'a+'});
if (fs.existsSync(output_path)) fs.unlinkSync(output_path);
var outputStream = fs.createWriteStream(output_path, {flags:'a+'});
var prev_line = undefined;

function chatToCSV(line){
    let tmp_stats = ChatStats.parse_line(line);
    let tmp_chat_message = tmp_stats.chat_message;
    if(tmp_chat_message !== undefined){
        tmp_chat_message = tmp_chat_message.replace(/\"/g, "\"\"").replace(/;/g, "").replace(/\n/g, " ");
    }
    let tmp_chat_emoji = Array.from(new Set(tmp_stats.emoji)).join(",");
    
    let tmp_values = [
        tmp_stats.author,
        tmp_stats.type,
        tmp_stats.timedate.getTime()/1000,
        tmp_chat_message,
        tmp_chat_emoji
    ];
    return tmp_values.join(";");
}

var s = fs.createReadStream(path)
    .pipe(es.split())
    .pipe(es.mapSync(function(line) {
        s.pause();
        if(prev_line !== undefined && line.match(/^(\d{2})\/(\d{2})\/(\d{2}), (\d{2}):(\d{2}) - /)){
            lines.push(prev_line);
            outputStreamOriginalCopy.write(prev_line + "\n");
            outputStream.write(chatToCSV(prev_line) + "\n");
            prev_line = line;
        } else if(prev_line !== undefined) {
            prev_line = prev_line + "\n" + line;
        } else {
            prev_line = line;
        }
        //prev_line += line;
        /*
        if(line.match(/^(\d{2})\/(\d{2})\/(\d{2}), (\d{2}):(\d{2}) - /)){
            prev_line = lines[lines.length-1];
            if(prev_line !== undefined) {
                lines.push(line);
                outputStream.write(line + "\n");
            }
        } else {
            lines[lines.length-1] = lines[lines.length-1] + " "+line;
        }
        */
        s.resume();
    })
    .on('error', function(err) {
        console.log('Error:', err);
    })
    .on('end', function() {
        lines.push(prev_line);
        outputStreamOriginalCopy.write(prev_line);
        outputStream.write(chatToCSV(prev_line) + "\n");
        console.log('Finish reading file.');
        console.log(lines.length);
        outputStreamOriginalCopy.end();
        outputStream.end();
    })
);

const args = process.argv.slice(2);
if(args[0] !== undefined && args[0] == "-d") repl.start('> ');