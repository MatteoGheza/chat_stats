export const Patterns = {
    BAD_CHARS: [
        "\u202a",
        "\u200e",
        "\u202c",
        "\xa0"
    ],
    IS_URL: /http[s]?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi,
    IS_CHAT: "([^:]+)(:)(.+)",
    IS_DELETED_CHAT: [
        ".*This message was deleted$", //EN
        ".*Questo messaggio è stato eliminato$", //IT
        ".*Hai eliminato questo messaggio$", //IT
        ".*Pesan ini telah dihapus$", //ID
    ],
    EVENTS: {
        created: [
            " created this group", //EN
            " created the group", //EN
            " ha creato il gruppo", //IT
        ],
        left: [
            " left$", //EN
            " ha abbandonato$", //IT
            " keluar$", //ID
        ],
        intro_security: [
            ".*Messages to this group are now secured with end-to-end encryption.*", //EN
            ".*I messaggi e le chiamate sono crittografati end-to-end.*", //IT
        ],
        member_security_code_changed: [
            ".*'s security code changed.*", //EN
            ".*Il tuo codice di sicurezza con.*", //IT
        ],
        member_changed_number: [
            " changed their phone number to a new number. Tap to message or add the new number.*", //EN
            " telah mengganti nomor teleponnya ke nomor baru. Ketuk untuk mengirim pesan atau menambahkan nomor baru.*", //ID
            " ha cambiato numero in.*", //IT
            " è stato cambiato con.*", //IT
        ],
        member_phone_number_replaced: [
            " è stato cambiato con " //IT
        ],
        join: [
            " joined using this group's invite link.*", //EN
            " è entrato usando il link d'invito al gruppo.*", //IT
            " telah bergabung menggunakan tautan undangan grup ini.*", //ID
        ],
        member_added: [
            " added ", //EN
            " ha aggiunto ", //IT
            " hai aggiunto ", //IT
            "Ha aggiunto ", //IT
            "Hai aggiunto ", //IT
            " ti ha aggiunto", //IT
            " è stato aggiunto", //IT
            " menambahkan ", //ID
        ],
        member_removed: [
            " removed ", //EN
            " ha rimosso ", //IT
            " hai rimosso ", //IT
            "Hai rimosso " //IT
        ],
        group_settings_changed: [
            " cambiato le impostazioni del gruppo " //IT
        ],
        group_image_changed: [
            " ha cambiato l'immagine " //IT
        ],
        group_description_changed: [
            " ha cambiato l'oggetto da ", //IT
            " ha cambiato la descrizione del gruppo" //IT
        ],
        someone_become_admin: [
            "Ora sei un amministratore" //IT
        ],
        someone_become_not_admin: [
            "Non sei più un amministratore" //IT
        ],
        someone_blocked: [
            "Hai bloccato questo contatto. Tocca per sbloccare" //IT
        ],
        someone_unblocked: [
            "Hai sbloccato questo contatto" //IT
        ]
    },
    ATTACHMENTS: {
        android_media: [
            "<Media omitted>", //EN
            "<Media omesso>", //IT
            "<Media omessi>", //IT
            "<Media tidak disertakan>", //ID
            "<Archivo omitido>", //ES
        ],
        image: [
            "<image omitted>", //EN
            "<imagen omitida>", //ES
        ],
        video: [
            "<video omitted>", //EN
            "<video omitido>", //ES
        ],
        document: [
            "<document omitted>", //EN
        ],
        contact_card: [
            "<Contact card omitted>", //EN
            ".vcf \\(file allegato\\).*", //IT
            "<.vcf.*",
        ],
        audio: [
            "<audio omitted>", //EN
            "<audio omitido>", //ES
        ],
        GIF: [
            "<GIF omitted>", //EN
            "<GIF omitido>", //ES
        ],
        sticker: [
            "<sticker omitted>", //EN
            "<sticker omitido>", //ES
        ]
    }
};