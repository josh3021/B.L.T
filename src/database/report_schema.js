let Schema = {};

Schema.createSchema = mongoose => {
    let ReportSchema = mongoose.Schema({
        username: {
            type: String,
            required: true,
            unique: false,
            'default': ''
        },
        telephone: {
            type: String,
            required: true,
            'default': ''
        },
        position: {
            x: {
                type: Number,
                required: true,
                'default': ''
            },
            y: {
                type: Number, 
                required: true,
                'default': ''
            }
        },
        danger: {
            type: Boolean,
            required: true,
            'default': true
        },
        report_at: {
            type: Date,
            unique: false,
            'default': Date.now
        }
    });

    return ReportSchema;
}

module.exports = Schema;
