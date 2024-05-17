-   Library

    -   bcrypt
    -   next-auth
    -   prisma
    -   date-fns
    -   axios
    -   react-hook-form
    -   react-hot-toast
    -   tailwind/forms
    -   react-select
    -   react-spinners
    -   pusher
    -   lodash (use with pusher)

-   Knowledge

    -   add ! at the end of props value, example: <DesktopSidebar currentUser={currentUser!} />: make currentUser value to be null
    -   If data type of props different with real data, declare special type for this in "folder" types, example:

        -   FullConversationType: trong file ConversationList

    -   Pusher
        -   server: Gồm 3 method:
            -   Trigger: Dùng để đẩy thông báo từ server đến client
                -   Gồm 3 tham số: channel, event name, data
            -   Get
            -   Post
        -   client: Gồm 4 method
            -   subcribe: Lắng nghe trên channel
            -   unsubscribe: Bỏ lắng nghe trên channel
            -   bind:
            -   unbind:
